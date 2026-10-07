using CampusEats.Api.Services;
using CampusEats.Api.Data;
using Microsoft.EntityFrameworkCore;
using CampusEats.Api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models; 

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// 👇 Swagger registration with JWT Support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => { 
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme { 
        Name = "Authorization", 
        In = ParameterLocation.Header, 
        Type = SecuritySchemeType.Http, 
        Scheme = "bearer", 
        BearerFormat = "JWT", 
        Description = "Paste ONLY the token - no 'Bearer' prefix." 
    }); 
    c.AddSecurityRequirement(new OpenApiSecurityRequirement { 
        { 
            new OpenApiSecurityScheme { 
                Reference = new OpenApiReference { 
                    Type = ReferenceType.SecurityScheme, 
                    Id = "Bearer" 
                }
            }, 
            Array.Empty<string>() 
        } 
    }); 
});

// 👇 Task 02 — Register EF Core DbContext
builder.Services.AddDbContext<AppDbContext>(opt => 
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// 👇 Task 02 Part B — DI registration (Scoped for EF Core)
builder.Services.AddScoped<IMenuService, MenuService>();

// 👇 Task 04 — JWT Authentication Setup
var jwt = builder.Configuration.GetSection("Jwt"); 
var key = Encoding.UTF8.GetBytes(jwt["Key"]!); 

builder.Services 
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme) 
    .AddJwtBearer(opt => opt.TokenValidationParameters = new TokenValidationParameters
    { 
        ValidateIssuer = true, 
        ValidIssuer = jwt["Issuer"], 
        ValidateAudience = true, 
        ValidAudience = jwt["Audience"], 
        ValidateIssuerSigningKey = true, 
        IssuerSigningKey = new SymmetricSecurityKey(key), 
        ValidateLifetime = true 
    }); 
builder.Services.AddAuthorization();

var app = builder.Build();

// 👇 Seed Data (Menu Items)
using (var scope = app.Services.CreateScope()) 
{ 
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>(); 
    if (!db.MenuItems.Any()) 
    { 
        db.MenuItems.AddRange( 
            new MenuItem { Name = "Kottu Roti", Price = 750m, Category = "Mains" }, 
            new MenuItem { Name = "Fried Rice", Price = 850m, Category = "Mains" }, 
            new MenuItem { Name = "Watalappan", Price = 350m, Category = "Dessert" }
        ); 
        db.SaveChanges(); 
    } 
}

// 👇 Swagger UI middleware
app.UseSwagger();
app.UseSwaggerUI();

// 👇 Authentication & Authorization middleware (MUST BE IN THIS EXACT ORDER)
app.UseAuthentication();    // 1st: Validates JWT - "Who are you?"
app.UseAuthorization();     // 2nd: Checks roles - "May you?"

app.MapControllers();

app.Run();