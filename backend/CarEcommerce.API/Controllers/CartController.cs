using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarEcommerce.API.Models;
using CarEcommerce.API.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace CarEcommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CartController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartDTO>>> GetCartItems()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var cartItems = await _context.Carts
                .Include(c => c.Car)
                .Where(c => c.UserId == userId)
                .Select(c => new CartDTO
                {
                    Id = c.Id,
                    CarId = c.CarId,
                    CarMake = c.Car.Make,
                    CarModel = c.Car.Model,
                    CarYear = c.Car.Year,
                    CarPrice = c.Car.Price,
                    Quantity = c.Quantity,
                    TotalPrice = c.Car.Price * c.Quantity,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .ToListAsync();

            return cartItems;
        }

        [HttpPost]
        public async Task<ActionResult<Cart>> AddToCart([FromBody] CartItemModel model)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            
            var existingItem = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserId == userId && c.CarId == model.CarId);

            if (existingItem != null)
            {
                existingItem.Quantity += model.Quantity;
                existingItem.UpdatedAt = DateTime.Now;
            }
            else
            {
                var cartItem = new Cart
                {
                    UserId = userId,
                    CarId = model.CarId,
                    Quantity = model.Quantity,
                    CreatedAt = DateTime.Now
                };
                _context.Carts.Add(cartItem);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCartItem(int id, [FromBody] CartItemModel model)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var cartItem = await _context.Carts
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (cartItem == null)
                return NotFound();

            cartItem.Quantity = model.Quantity;
            cartItem.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            
            // First try to find the cart item
            var cartItem = await _context.Carts
                .FirstOrDefaultAsync(c => c.CarId == id && c.UserId == userId);

            if (cartItem == null)
            {
                return NotFound($"Cart item with CarId {id} not found");
            }

            try
            {
                _context.Carts.Remove(cartItem);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var cartItems = await _context.Carts
                .Where(c => c.UserId == userId)
                .ToListAsync();

            _context.Carts.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class CartItemModel
    {
        public int CarId { get; set; }
        public int Quantity { get; set; }
    }

    public class CartDTO
    {
        public int Id { get; set; }
        public int CarId { get; set; }
        public string CarMake { get; set; }
        public string CarModel { get; set; }
        public int CarYear { get; set; }
        public decimal CarPrice { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
} 