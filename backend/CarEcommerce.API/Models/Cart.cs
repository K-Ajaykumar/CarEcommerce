using System;
using System.ComponentModel.DataAnnotations;

namespace CarEcommerce.API.Models
{
    public class Cart
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        public User User { get; set; }
        
        [Required]
        public int CarId { get; set; }
        public Car Car { get; set; }
        
        [Required]
        public int Quantity { get; set; }
        
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
} 