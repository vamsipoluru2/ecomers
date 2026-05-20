<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard | E-Commerce</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
    <style>
        body {
            background: linear-gradient(to right, #e3f2fd, #ffffff);
            font-family: 'Segoe UI', sans-serif;
        }
        .dashboard-container {
            margin-top: 80px;
        }
        h2 {
            text-align: center;
            color: #007bff;
            font-weight: bold;
            margin-bottom: 40px;
        }
        .card {
            border-radius: 15px;
            padding: 35px 20px;
            text-align: center;
            color: white;
            font-weight: 600;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
        }
        .manage { background-color: #007bff; }
        .stats { background-color: #198754; }
        .orders { background-color: #ffc107; color: #333; }
        footer {
            margin-top: 60px;
            text-align: center;
            color: #555;
        }
    </style>
</head>

<body>

<div class="container dashboard-container">
    <h2>📊 Admin Dashboard</h2>

    <div class="row justify-content-center">
        <!-- Manage Products -->
        <div class="col-md-3 mx-3 mb-4">
            <a href="${pageContext.request.contextPath}/admin/products" style="text-decoration: none;">
                <div class="card manage shadow">
                    <h4>🛠️ Manage Products</h4>
                    <p>Add, Edit, or Delete Products</p>
                </div>
            </a>
        </div>

        <!-- View Statistics (Updated Link) -->
        <div class="col-md-3 mx-3 mb-4">
            <a href="${pageContext.request.contextPath}/admin/statistics" style="text-decoration: none;">
                <div class="card stats shadow">
                    <h4>📈 View Statistics</h4>
                    <p>Basic Overview (Dummy Data)</p>
                </div>
            </a>
        </div>

        <!-- View Orders -->
        <div class="col-md-3 mx-3 mb-4">
            <a href="${pageContext.request.contextPath}/orders" style="text-decoration: none;">
                <div class="card orders shadow">
                    <h4>📦 View Orders</h4>
                    <p>Check All Customer Orders</p>
                </div>
            </a>
        </div>
    </div>

    <footer>
        <p>© 2025 E-Commerce Admin Panel | Built with ❤️ using Spring Boot + JSP</p>
    </footer>
</div>

</body>
</html>
 