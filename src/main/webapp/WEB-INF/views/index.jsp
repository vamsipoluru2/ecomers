<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>QuickMart | Home</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            margin: 0;
            font-family: 'Poppins', sans-serif;
            background-color: #ffffff;
            color: #111;
        }

        /* Navbar */
        .navbar {
            background-color: #fff;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .navbar-brand {
            font-weight: 700;
            letter-spacing: 2px;
            color: #000 !important;
        }

        .nav-link {
            font-weight: 500;
            color: #000 !important;
            margin-right: 20px;
            transition: color 0.2s ease-in-out;
        }

        .nav-link:hover {
            color: #0d6efd !important;
        }

        /* Hero Section */
        .hero-section {
            height: 90vh;
            background-color: #f8f9fa;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .hero-section h1 {
            font-size: 3rem;
            font-weight: 700;
            letter-spacing: 1px;
        }

        .hero-section p {
            font-size: 1.2rem;
            color: #555;
            margin-bottom: 30px;
        }

        .btn-dark {
            border-radius: 30px;
            padding: 12px 30px;
            font-weight: 500;
        }

        /* Footer */
        footer {
            background-color: #fff;
            color: #777;
            padding: 15px 0;
            text-align: center;
            font-size: 0.9rem;
        }

        /* Logged-in User Info (Black & White) */
        .user-info {
            font-weight: 500;
            color: #000;
            background: #f1f1f1;
            border-radius: 25px;
            padding: 6px 14px;
            margin-right: 10px;
            display: flex;
            align-items: center;
        }

        .user-info span {
            font-weight: 600;
            color: #000;
            margin-left: 5px;
        }

        /* Logout button (Black & White theme) */
        .logout-btn {
            border-radius: 25px;
            border: 1px solid #000;
            color: #000;
            font-weight: 500;
            background-color: transparent;
            transition: all 0.3s ease;
        }

        .logout-btn:hover {
            background-color: #000;
            color: #fff;
        }

        /* Popup alert */
        .custom-alert {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            width: 320px;
            display: none;
        }

        @media (max-width: 768px) {
            .hero-section h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light py-3">
        <div class="container">
            <a class="navbar-brand" href="/">QUICKMART</a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">

                    <!-- Always show -->
                    <li class="nav-item"><a class="nav-link active" href="/">HOME</a></li>

                    <!-- 🧍 GUEST -->
                    <c:if test="${empty sessionScope.loggedUser}">
                        <li class="nav-item"><a class="nav-link" href="#" onclick="showLoginAlert()">ORDERS</a></li>
                        <li class="nav-item"><a class="nav-link" href="#" onclick="showLoginAlert()">CART</a></li>
                        <li class="nav-item"><a href="/login" class="btn btn-outline-dark me-2 px-3">LOGIN</a></li>
                        <li class="nav-item"><a href="/register" class="btn btn-outline-dark px-3">SIGN UP</a></li>
                    </c:if>

                    <!-- 👋 LOGGED-IN USER -->
                    <c:if test="${not empty sessionScope.loggedUser}">
                        <li class="nav-item"><a class="nav-link" href="/orders">ORDERS</a></li>
                        <li class="nav-item"><a class="nav-link" href="/cart">CART</a></li>

                        <li class="nav-item d-flex align-items-center user-info">
                            👋 Logged in as:
                            <span><c:out value="${sessionScope.loggedUser.name}" default="User"/></span>
                        </li>

                        <li class="nav-item">
                            <a href="/logout" class="btn logout-btn px-3">LOGOUT</a>
                        </li>
                    </c:if>

                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <h1>WELCOME TO QUICKMART</h1>
            <p>Your one-stop shop for all things Ecommerce.</p>
            <a href="/products" class="btn btn-dark btn-lg">SHOP NOW</a>
        </div>
    </section>

    <!-- Footer -->
    <footer>© 2025 QuickMart. All Rights Reserved.</footer>

    <!-- Login Popup -->
    <div class="custom-alert alert alert-warning alert-dismissible fade show text-center" role="alert" id="loginAlert">
        ⚠️ Please login to continue!
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function showLoginAlert() {
            const alert = document.getElementById('loginAlert');
            alert.style.display = 'block';
            alert.classList.add('show');
            setTimeout(() => {
                alert.style.display = 'none';
                window.location.href = "/login";
            }, 2500);
        }
    </script>
</body>
</html>
 