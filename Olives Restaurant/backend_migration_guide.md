# Olives Restaurant — ASP.NET Core MVC Migration Guide
> Complete beginner-friendly guide: from static HTML to a live C# web application with MySQL.

---

## ❓ First: Real Images vs. URL Links — Which Is Better?

You currently use Unsplash URLs for menu images. Here is a clear comparison:

| | URL Links (current) | Local Images (wwwroot) |
|---|---|---|
| **Setup** | Zero effort | You need real photos |
| **Speed** | Depends on Unsplash CDN | Your server / CDN |
| **Control** | None — links can break | Full control |
| **Production** | Bad — images disappear | ✅ Recommended |
| **Admin upload** | Not possible | ✅ Admin can upload via form |

**Recommendation:** For a production restaurant site, use **local images stored in `wwwroot/images/`**. You will build an upload form in the Admin Dashboard so the owner can upload real dish and drink photos. For now during development, URLs are fine to keep things moving.

---

## 🗺️ How ASP.NET Core MVC Works (For Beginners)

Think of MVC like a restaurant kitchen:

- **Model** = The recipe card. It describes the data (a Dish has a name, price, image).
- **View** = The plate. It is what the customer sees (your `.html` files become `.cshtml` Razor files).
- **Controller** = The chef. It reads the recipe, cooks the data, and puts it on the plate.

**Data Flow (every page request):**
```
Browser → Controller → (reads from) Database → Model → View → Browser
```

---

## 📁 Project Folder Structure

```
OlivesRestaurant/
├── Controllers/
├── Models/
├── Views/
│   ├── _ViewImports.cshtml  ← tells all views where models are
│   ├── _ViewStart.cshtml    ← automatically applies _Layout to all views
│   ├── Home/
│   ├── Menu/
│   ├── Drinks/
│   ├── Auth/
│   ├── Admin/
│   ├── Customer/
│   └── Shared/
│       └── _Layout.cshtml   ← shared nav + footer
├── wwwroot/
│   ├── css/
│   ├── js/
│   └── images/
│       ├── dishes/
│       └── drinks/
├── Data/
│   └── AppDbContext.cs
├── appsettings.json
└── Program.cs
```

---

## 🧱 Phase 1 — Create the Visual Studio Project

*Layman's note: This is where you create the empty shell for your new website. We also install extra "plugins" (NuGet packages) that teach C# how to talk to MySQL.*

1. Open **Visual Studio 2022**.
2. Click **Create a new project**.
3. Search for **ASP.NET Core Web App (Model-View-Controller)** → Next.
4. Name it `OlivesRestaurant` → choose folder → Next.
5. Select **.NET 8.0** → Authentication: None → Create.

### Install NuGet Packages
Go to **Tools → NuGet Package Manager → Package Manager Console** and run:
```powershell
Install-Package Pomelo.EntityFrameworkCore.MySql
Install-Package Microsoft.EntityFrameworkCore.Tools
Install-Package Microsoft.EntityFrameworkCore.Design
Install-Package BCrypt.Net-Next
```

---

## 🧱 Phase 2 — Models (C# Files in `Models/` folder)

*Layman's note: Models are just blueprints. They tell the database exactly what columns to create (e.g., "A Dish has a Name and a Price"). Create a new `.cs` file for each of these inside the `Models` folder.*

**`Models/User.cs`**
```csharp
namespace OlivesRestaurant.Models;

public class User {
    public int Id { get; set; }
    public string FullName { get; set; } = "";
    public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string Role { get; set; } = "Customer"; // "Customer" or "Admin"
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
```

**`Models/Category.cs`**
```csharp
namespace OlivesRestaurant.Models;

public class Category {
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Type { get; set; } = "Food"; // "Food" or "Drink"
    public List<Dish> Dishes { get; set; } = new();
    public List<Drink> Drinks { get; set; } = new();
}
```

**`Models/Dish.cs`**
```csharp
namespace OlivesRestaurant.Models;

public class Dish {
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? ImagePath { get; set; }
    public string? Tag { get; set; }
    public bool IsAvailable { get; set; } = true;
    public int Discount { get; set; } = 0;
}
```

**`Models/Reservation.cs`**
```csharp
namespace OlivesRestaurant.Models;

public class Reservation {
    public int Id { get; set; }
    public int? UserId { get; set; }
    public User? User { get; set; }
    public string GuestName { get; set; } = "";
    public string GuestEmail { get; set; } = "";
    public string? GuestPhone { get; set; }
    public DateTime Date { get; set; }
    public TimeSpan Time { get; set; }
    public int Covers { get; set; } = 2;
    public string? Occasion { get; set; }
    public string? Notes { get; set; }
    public int? TableNumber { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
```

---

## 🧱 Phase 3 — Database Context & Connection

*Layman's note: The `AppDbContext` is the bridge between your C# code and your MySQL database. We also set up `Program.cs` to handle user logins (Sessions).*

Create a folder named `Data` and add this file:

**`Data/AppDbContext.cs`**
```csharp
using Microsoft.EntityFrameworkCore;
using OlivesRestaurant.Models;

namespace OlivesRestaurant.Data;

public class AppDbContext : DbContext {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Dish> Dishes { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
}
```

**`appsettings.json`**
Add your MySQL connection string right above the `"Logging"` section:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=olives_restaurant;User=root;Password=YOUR_PASSWORD;"
},
```

**`Program.cs`**
⚠️ **Order matters here!** Replace the default content with this:
```csharp
using Microsoft.EntityFrameworkCore;
using OlivesRestaurant.Data;

var builder = WebApplication.CreateBuilder(args);

// Add MVC Controllers and Views
builder.Services.AddControllersWithViews();

// Connect to MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
);

// Enable Sessions for Login
builder.Services.AddSession(options => {
    options.IdleTimeout = TimeSpan.FromHours(2);
    options.Cookie.HttpOnly = true;
});

var app = builder.Build();

if (!app.Environment.IsDevelopment()) {
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseSession(); // MUST BE BETWEEN UseRouting AND UseAuthorization!
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
```

---

## 🚀 Phase 4 — EF Core Migrations (Creating the Database)

*Layman's note: Instead of manually typing SQL commands, Visual Studio will read your C# Models and magically create the database tables for you. This prevents errors.*

1. Open your MySQL program (like MySQL Workbench) and create an empty database named `olives_restaurant`.
2. In Visual Studio, go to **Tools → NuGet Package Manager → Package Manager Console**.
3. Run this command to generate the blueprint:
   ```powershell
   Add-Migration InitialCreate
   ```
4. Run this command to build the tables in MySQL:
   ```powershell
   Update-Database
   ```

---

## 🧱 Phase 5 — View Configuration & Layout

*Layman's note: We don't want to copy and paste the navigation bar and footer onto every single page. Instead, we create a `_Layout.cshtml` file. Think of it as a picture frame. The unique content of each page is swapped inside the frame.*

**`Views/_ViewImports.cshtml`**
Create this file directly inside the `Views/` folder. It saves you from typing long names in your HTML.
```html
@using OlivesRestaurant
@using OlivesRestaurant.Models
@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers
```

**`Views/_ViewStart.cshtml`**
Create this file inside the `Views/` folder. It tells all pages to automatically use the picture frame layout.
```html
@{
    Layout = "_Layout";
}
```

**`Views/Shared/_Layout.cshtml`**
Replaces the copy-pasted nav/footer. Notice the `@RenderBody()` line—that's where the page content goes!
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>@ViewData["Title"] — Olives Restaurant</title>
    <link rel="stylesheet" href="~/css/style.css" />
    @RenderSection("PageCss", required: false)
</head>
<body>
    <nav class="nav @ViewData["NavClass"]" id="navbar">
        <!-- your full nav HTML here — written once -->
        @if (Context.Session.GetString("UserRole") == "Admin") {
            <a href="/Admin">Dashboard</a>
        } else if (Context.Session.GetString("UserId") != null) {
            <a href="/Customer">My Account</a>
            <a href="/Auth/Logout">Logout</a>
        } else {
            <a href="/Auth/Login">Login</a>
        }
    </nav>

    @RenderBody() <!-- The unique page content loads here -->

    <footer class="footer"><!-- footer HTML once --></footer>
    <script src="~/js/main.js"></script>
    @RenderSection("PageJs", required: false)
</body>
</html>
```

---

## 🧱 Phase 6 — The Menu Controller

*Layman's note: Controllers pull data from the database and hand it to the View (HTML) to display. Here, we fetch all Food categories and their dishes.*

**`Controllers/MenuController.cs`**
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OlivesRestaurant.Data;
using OlivesRestaurant.Models;

namespace OlivesRestaurant.Controllers;

public class MenuController : Controller {
    private readonly AppDbContext _db;
    public MenuController(AppDbContext db) { _db = db; }

    public IActionResult Index() {
        // Find all categories that are "Food", and include their available dishes
        var categories = _db.Categories
            .Where(c => c.Type == "Food")
            .Include(c => c.Dishes.Where(d => d.IsAvailable))
            .ToList();
        return View(categories);
    }
}
```

---

## 🧱 Phase 7 — Authentication (Login/Register)

*Layman's note: We need a secure way for users to log in. This controller checks passwords and uses "Sessions" (temporary memory) to remember who is logged in as they browse the site.*

**`Controllers/AuthController.cs`**
```csharp
using Microsoft.AspNetCore.Mvc;
using OlivesRestaurant.Data;
using OlivesRestaurant.Models;

namespace OlivesRestaurant.Controllers;

public class AuthController : Controller {
    private readonly AppDbContext _db;
    public AuthController(AppDbContext db) { _db = db; }

    [HttpGet]
    public IActionResult Login() => View();

    [HttpPost]
    public IActionResult Login(string email, string password) {
        var user = _db.Users.FirstOrDefault(u => u.Email == email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash)) {
            ViewBag.Error = "Invalid email or password.";
            return View();
        }
        
        // Save user info to temporary memory (Session)
        HttpContext.Session.SetInt32("UserId", user.Id);
        HttpContext.Session.SetString("UserRole", user.Role);
        HttpContext.Session.SetString("UserName", user.FullName);

        // Send admins to the Admin dashboard, and customers to the Customer dashboard
        return user.Role == "Admin" ? RedirectToAction("Index", "Admin") : RedirectToAction("Index", "Customer");
    }

    [HttpPost]
    public IActionResult Register(string fullName, string email, string password) {
        if (_db.Users.Any(u => u.Email == email)) {
            ViewBag.Error = "Email already registered.";
            return View("Login");
        }
        _db.Users.Add(new User {
            FullName = fullName,
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password), // Never save plain text passwords!
            Role = "Customer"
        });
        _db.SaveChanges();
        return RedirectToAction("Login");
    }

    public IActionResult Logout() {
        HttpContext.Session.Clear(); // Forget the user
        return RedirectToAction("Index", "Home");
    }
}
```

---

## 🧱 Phase 8 — Admin Dashboard (Basic Stats)

*Layman's note: The Admin Controller protects pages so only staff can see them. The main Index page counts the total dishes and pending bookings.*

**`Controllers/AdminController.cs`**
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OlivesRestaurant.Data;
using OlivesRestaurant.Models;

namespace OlivesRestaurant.Controllers;

public class AdminController : Controller {
    private readonly AppDbContext _db;
    public AdminController(AppDbContext db) { _db = db; }

    // Helper to check if the person is an Admin
    private bool IsAdmin() => HttpContext.Session.GetString("UserRole") == "Admin";

    public IActionResult Index() {
        if (!IsAdmin()) return RedirectToAction("Login", "Auth");
        
        // Count things for the dashboard cards
        ViewBag.PendingBookings = _db.Reservations.Count(r => r.Status == "Pending");
        ViewBag.TotalCustomers = _db.Users.Count(u => u.Role == "Customer");
        return View();
    }
}
```

---

## 🧱 Phase 9 — Customer Dashboard (CustomerController)

*Layman's note: When regular users log in, they need a place to see their profile and their past table reservations. We grab their unique `UserId` from the Session and pull only their records from the database.*

**`Controllers/CustomerController.cs`**
```csharp
using Microsoft.AspNetCore.Mvc;
using OlivesRestaurant.Data;

namespace OlivesRestaurant.Controllers;

public class CustomerController : Controller {
    private readonly AppDbContext _db;
    public CustomerController(AppDbContext db) { _db = db; }

    // Helper to check if they are a customer
    private bool IsCustomer() => HttpContext.Session.GetString("UserRole") == "Customer";

    public IActionResult Index() {
        // Kick them out if they aren't logged in
        if (!IsCustomer()) return RedirectToAction("Login", "Auth");

        // Grab their ID from memory
        int userId = HttpContext.Session.GetInt32("UserId")!.Value;
        
        // Find all reservations belonging to this user, sorted newest first
        ViewBag.Reservations = _db.Reservations
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.Date)
            .ToList();
            
        return View();
    }
}
```

---

## 🧱 Phase 10 — Admin Advanced (Menu CRUD, Uploads, Reservations)

*Layman's note: "CRUD" stands for Create, Read, Update, Delete. We need to let the Admin add new dishes, upload photos, and change the status of table reservations. Add these methods inside your `AdminController`.*

**Add these inside `Controllers/AdminController.cs`:**
```csharp
    // 1. View all reservations
    public IActionResult Reservations() {
        if (!IsAdmin()) return RedirectToAction("Login", "Auth");
        var list = _db.Reservations.OrderByDescending(r => r.Date).ToList();
        return View(list);
    }

    // 2. Accept or Cancel a reservation
    [HttpPost]
    public IActionResult UpdateReservation(int id, string status) {
        if (!IsAdmin()) return Unauthorized();
        var booking = _db.Reservations.Find(id);
        if (booking != null) { 
            booking.Status = status; // e.g. "Confirmed"
            _db.SaveChanges(); 
        }
        return RedirectToAction("Reservations");
    }

    // 3. View all dishes (The Menu Editor)
    public IActionResult Menu() {
        if (!IsAdmin()) return RedirectToAction("Login", "Auth");
        var dishes = _db.Dishes.Include(d => d.Category).ToList();
        return View(dishes);
    }

    // 4. Create a new dish AND upload an image
    [HttpPost]
    public async Task<IActionResult> AddDish(Dish model, IFormFile? imageFile) {
        if (!IsAdmin()) return Unauthorized();

        if (imageFile != null && imageFile.Length > 0) {
            // SAFETY: Create the 'wwwroot/images/dishes' folder if it doesn't exist yet
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "dishes");
            if (!Directory.Exists(uploadsFolder)) {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Give the image a random name so it doesn't overwrite anything (e.g. 5d4f2-xyz.jpg)
            var fileName = Guid.NewGuid() + Path.GetExtension(imageFile.FileName);
            var path = Path.Combine(uploadsFolder, fileName);
            using var stream = new FileStream(path, FileMode.Create);
            await imageFile.CopyToAsync(stream);
            
            // Save the path to the database
            model.ImagePath = "/images/dishes/" + fileName;
        }
        
        _db.Dishes.Add(model);
        _db.SaveChanges();
        return RedirectToAction("Menu");
    }
```

---

## 🧱 Phase 11 — Testing Locally

*Layman's note: You should NEVER deploy an app before testing it on your own computer. Visual Studio hosts a tiny, temporary server on your computer for you to play around with safely.*

1. **Start the App:** In Visual Studio, look for the solid green "Play" button at the top that says "OlivesRestaurant" (or press **F5** on your keyboard).
2. A browser window will open automatically to something like `https://localhost:7123`.
3. Click your **Login** button and register a new account.
4. Try booking a table.
5. In MySQL Workbench, manually change your test user's `Role` from `Customer` to `Admin`.
6. Log out and log back in. You should now be taken to the Admin Dashboard!
7. Try uploading a dish photo and see if it appears in your `wwwroot/images/dishes` folder.

If something crashes, Visual Studio will show you a yellow screen with the exact line of C# code that failed.

---

## 🧱 Phase 12 — Going Live (Deployment)

*Layman's note: Once everything is perfect on your computer, it's time to put it on a real server so the public can visit it.*

### Option A — Shared Hosting (Easiest & Cheapest for beginners)
1. Sign up for a Windows hosting provider that supports **ASP.NET Core 8** (e.g., SmarterASP.NET or Somee).
2. In Visual Studio: Right-click your project in Solution Explorer → **Publish** → choose **Folder** → click Publish.
3. Use an FTP program (like FileZilla) to copy all the files from that folder to your hosting server.
4. Create a MySQL database using the host's control panel.
5. Update your `appsettings.json` file on the server with the new, live database password.

### Option B — Azure App Service (Microsoft's Cloud)
1. Create a free Azure account.
2. In Visual Studio: Right-click project → **Publish** → **Azure** → **Azure App Service (Windows)**.
3. Visual Studio will guide you through creating the server and will upload the files automatically.
4. You will need to create an "Azure Database for MySQL" to store your live data.

---

## ✅ Phase Checklist Summary

- `[ ]` **1** — Create VS project, install NuGet packages.
- `[ ]` **2** — Write C# Model classes (namespaces are important!).
- `[ ]` **3** — Create `AppDbContext` and properly order `Program.cs`.
- `[ ]` **4** — Run `Add-Migration InitialCreate` and `Update-Database`.
- `[ ]` **5** — Copy CSS/JS to `wwwroot/`. Create `_ViewImports`, `_ViewStart`, and `_Layout.cshtml`.
- `[ ]` **6** — Build HomeController + Index view (Copy your index.html here).
- `[ ]` **7** — Build Menu & Drinks controllers and Razor views.
- `[ ]` **8** — Build AuthController (Login, Register).
- `[ ]` **9** — Build CustomerController (Dashboard).
- `[ ]` **10** — Build AdminController (Menu CRUD, Upload logic, Reservations).
- `[ ]` **11** — Test everything locally by pressing F5 in Visual Studio.
- `[ ]` **12** — Deploy to SmarterASP.NET or Azure when ready.
