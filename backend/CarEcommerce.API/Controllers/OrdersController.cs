using System;
using System.Collections.Generic;
using System.Threading.Tasks;
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
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            return await _context.Orders
                .Include(o => o.Car)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var order = await _context.Orders
                .Include(o => o.Car)
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder([FromBody] OrderModel model)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var car = await _context.Cars.FindAsync(model.CarId);

            if (car == null)
                return NotFound("Car not found");

            if (car.StockQuantity < model.Quantity)
                return BadRequest("Insufficient stock");

            var order = new Order
            {
                UserId = userId,
                CarId = model.CarId,
                Quantity = model.Quantity,
                TotalPrice = car.Price * model.Quantity,
                Status = "Pending",
                ShippingAddress = model.ShippingAddress,
                OrderDate = DateTime.Now
            };

            car.StockQuantity -= model.Quantity;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] StatusUpdateModel model)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound();

            order.Status = model.Status;
            
            if (model.Status == "Shipped")
                order.ShippedDate = DateTime.Now;
            else if (model.Status == "Delivered")
                order.DeliveredDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public class OrderModel
    {
        public int CarId { get; set; }
        public int Quantity { get; set; }
        public string ShippingAddress { get; set; }
    }

    public class StatusUpdateModel
    {
        public string Status { get; set; }
    }
} 