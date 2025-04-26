using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using CarEcommerce.API.Data;
using CarEcommerce.API.Models;
using CarEcommerce.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Car Ecommerce API", Version = "v1" });
    
    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below. Example: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Configure DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]))
        };
    });

// Add Authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Add AuthService
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Car Ecommerce API v1");
        c.RoutePrefix = "swagger";
    });
}

// Use CORS before other middleware
app.UseCors();

// Comment out HTTPS redirection in development
// app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ApplicationDbContext>();
    
    if (!context.Cars.Any())
    {
        context.Cars.AddRange(
            new Car
            {
                Make = "Tesla",
                Model = "Model S",
                Year = 2023,
                Price = 89990.00M,
                Color = "Red",
                EngineType = "Dual Motor All-Wheel Drive",
                Transmission = "Single-Speed",
                Mileage = 0,
                Description = "The Tesla Model S is a full-size all-electric five-door, luxury liftback car.",
                ImageUrl = "assets/cars/tesla-model-s.jpg",
                StockQuantity = 5
            },
            new Car
            {
                Make = "Tesla",
                Model = "Model 3",
                Year = 2023,
                Price = 41990.00M,
                Color = "Blue",
                EngineType = "Single Motor Rear-Wheel Drive",
                Transmission = "Single-Speed",
                Mileage = 0,
                Description = "The Tesla Model 3 is a compact executive sedan that is battery powered and produced by Tesla.",
                ImageUrl = "assets/cars/tesla-model-3.jpg",
                StockQuantity = 8
            },
            new Car
            {
                Make = "Ford",
                Model = "Mustang Mach-E",
                Year = 2023,
                Price = 45995.00M,
                Color = "Black",
                EngineType = "Dual Motor All-Wheel Drive",
                Transmission = "Single-Speed",
                Mileage = 0,
                Description = "The Ford Mustang Mach-E is a battery electric compact crossover SUV.",
                ImageUrl = "assets/cars/ford-mustang-mach-e.jpg",
                StockQuantity = 4
            },
            new Car
            {
                Make = "Skoda",
                Model = "Octavia",
                Year = 2023,
                Price = 32990.00M,
                Color = "Silver",
                EngineType = "2.0L TSI",
                Transmission = "Automatic",
                Mileage = 0,
                Description = "The Skoda Octavia is a practical and spacious family car with excellent build quality.",
                ImageUrl = "assets/cars/Skoda Octavia.jpeg",
                StockQuantity = 6
            },
            new Car
            {
                Make = "Volkswagen",
                Model = "Polo",
                Year = 2023,
                Price = 24990.00M,
                Color = "White",
                EngineType = "1.5L TSI",
                Transmission = "Automatic",
                Mileage = 0,
                Description = "The Volkswagen Polo is a supermini car that offers great value and practicality.",
                ImageUrl = "assets/cars/Volkswagen Polo.jpeg",
                StockQuantity = 10
            },
            new Car
            {
                Make = "Ferrari",
                Model = "488",
                Year = 2023,
                Price = 279990.00M,
                Color = "Red",
                EngineType = "3.9L V8 Twin-Turbo",
                Transmission = "Automatic",
                Mileage = 0,
                Description = "The Ferrari 488 is a mid-engine sports car that represents the pinnacle of Italian automotive engineering.",
                ImageUrl = "assets/cars/Ferrari 488.jpeg",
                StockQuantity = 2
            },
            new Car
            {
                Make = "Mercedes-Benz",
                Model = "C-Class",
                Year = 2023,
                Price = 45990.00M,
                Color = "Black",
                EngineType = "2.0L Turbo",
                Transmission = "Automatic",
                Mileage = 0,
                Description = "The Mercedes-Benz C-Class is a luxury compact executive car with premium features.",
                ImageUrl = "assets/cars/Mercedes-Benz C-Class.jpeg",
                StockQuantity = 5
            },
            new Car
            {
                Make = "Jaguar",
                Model = "F-Type",
                Year = 2023,
                Price = 72990.00M,
                Color = "British Racing Green",
                EngineType = "5.0L V8",
                Transmission = "Automatic",
                Mileage = 0,
                Description = "The Jaguar F-Type is a luxury sports car that combines British elegance with performance.",
                ImageUrl = "assets/cars/Jaguar F-Type.jpeg",
                StockQuantity = 3
            },
            new Car
            {
                Make = "BMW",
                Model = "X5",
                Year = 2023,
                Price = 65990.00M,
                Color = "Blue",
                EngineType = "3.0L Twin-Turbo",
                Transmission = "Automatic",
                Mileage = 0,
                Description = "The BMW X5 is a luxury SUV that offers a perfect blend of comfort and performance.",
                ImageUrl = "assets/cars/BMW X5.jpeg",
                StockQuantity = 4
            },
            new Car
            {
                Make = "Audi",
                Model = "A4",
                Year = 2023,
                Price = 42990.00M,
                Color = "Gray",
                EngineType = "2.0L TFSI",
                Transmission = "Automatic",
                Mileage = 0,
                Description = "The Audi A4 is a premium compact executive car with advanced technology and comfort.",
                ImageUrl = "assets/cars/Audi A4.jpeg",
                StockQuantity = 7
            },
            new Car
            {
                Make = "Mercedes-Benz",
                Model = "S-Class",
                Year = 2023,
                Price = 119990.00M,
                Color = "Silver",
                EngineType = "3.0L Hybrid",
                Transmission = "Automatic",
                Mileage = 0,
                Description = "The Mercedes-Benz S-Class is the flagship luxury sedan with cutting-edge technology and comfort.",
                ImageUrl = "assets/cars/Benz.jpeg",
                StockQuantity = 3
            }
        );
        
        context.SaveChanges();
    }
}

app.Run();
