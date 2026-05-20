<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <title>Login | E-Commerce</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
    <style>
        body {
            background: linear-gradient(to right, #eef2f3, #8e9eab);
            font-family: 'Segoe UI', sans-serif;
        }
        .login-card {
            margin-top: 80px;
            border-radius: 12px;
            overflow: hidden;
        }
        .login-header {
            background: #007bff;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .login-body {
            padding: 25px;
        }
        .form-control {
            border-radius: 8px;
        }
        .btn-primary {
            border-radius: 8px;
        }
        .register-link {
            text-align: center;
            margin-top: 10px;
        }
    </style>
</head>
<body>

<div class="container col-md-4">
    <div class="card shadow-lg login-card">
        <div class="login-header">
            <h3>Welcome Back 👋</h3>
            <p>Please login to your account</p>
        </div>
        <div class="login-body">
            <!-- ✅ Corrected form action -->
            <form action="${pageContext.request.contextPath}/login" method="post">
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" name="email" class="form-control" placeholder="Enter your email" required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Password</label>
                    <input type="password" name="password" class="form-control" placeholder="Enter your password" required>
                </div>

                <button type="submit" class="btn btn-primary w-100">Login</button>
            </form>

            <!-- ✅ Messages -->
            <c:if test="${not empty error}">
                <div class="alert alert-danger text-center mt-3">${error}</div>
            </c:if>

            <c:if test="${not empty message}">
                <div class="alert alert-success text-center mt-3">${message}</div>
            </c:if>

            <c:if test="${param.logout != null}">
                <div class="alert alert-info text-center mt-3">
                    You have been logged out successfully.
                </div>
            </c:if>

            <div class="register-link">
                <p>Don't have an account? <a href="${pageContext.request.contextPath}/register" class="text-decoration-none">Register here</a></p>
            </div>
        </div>
    </div>
</div>

</body>
</html>

</body>
</html>



