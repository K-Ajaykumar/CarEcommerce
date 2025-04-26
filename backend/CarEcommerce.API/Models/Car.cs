#nullable enable

using System;
using System.ComponentModel.DataAnnotations;

namespace CarEcommerce.API.Models
{
    public class Car
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Make { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Model { get; set; } = string.Empty;
        
        [Required]
        public int Year { get; set; }
        
        [Required]
        public decimal Price { get; set; }
        
        [Required]
        public string Color { get; set; } = string.Empty;
        
        [Required]
        public string EngineType { get; set; } = string.Empty;
        
        [Required]
        public string Transmission { get; set; } = string.Empty;
        
        [Required]
        public int Mileage { get; set; }
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public string ImageUrl { get; set; } = string.Empty;
        
        [Required]
        public int StockQuantity { get; set; }
    }
} 