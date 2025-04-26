using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarEcommerce.API.Models;
using CarEcommerce.API.Data;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace CarEcommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CarsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Car>>> GetCars()
        {
            return await _context.Cars.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Car>> GetCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
            {
                return NotFound();
            }

            return car;
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Car>>> SearchCars([FromQuery] string term)
        {
            if (string.IsNullOrEmpty(term))
            {
                return await _context.Cars.ToListAsync();
            }

            var cars = await _context.Cars
                .Where(c => c.Make.Contains(term) || c.Model.Contains(term))
                .ToListAsync();

            return cars;
        }

        [HttpGet("brand/{brand}")]
        public async Task<ActionResult<IEnumerable<Car>>> GetCarsByBrand(string brand)
        {
            if (string.IsNullOrEmpty(brand))
            {
                return await _context.Cars.ToListAsync();
            }

            var cars = await _context.Cars
                .Where(c => c.Make == brand)
                .ToListAsync();

            return cars;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Car>> CreateCar(Car car)
        {
            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCar), new { id = car.Id }, car);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCar(int id, Car car)
        {
            if (id != car.Id)
            {
                return BadRequest();
            }

            _context.Entry(car).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CarExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null)
            {
                return NotFound();
            }

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CarExists(int id)
        {
            return _context.Cars.Any(e => e.Id == id);
        }
    }
} 