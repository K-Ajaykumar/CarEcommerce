using System;
using System.ComponentModel.DataAnnotations;

namespace CarEcommerce.API.Models
{
    public class Order
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
        
        [Required]
        public decimal TotalPrice { get; set; }
        
        [Required]
        public string Status { get; set; } // Pending, Processing, Shipped, Delivered, Cancelled
        
        [Required]
        public string ShippingAddress { get; set; }
        
        public DateTime OrderDate { get; set; }
        public DateTime? ShippedDate { get; set; }
        public DateTime? DeliveredDate { get; set; }
    }
} 