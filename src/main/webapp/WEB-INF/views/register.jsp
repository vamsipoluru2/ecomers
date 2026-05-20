<%@page contentType="text/html;charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <title>Register</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
</head>
<body class="bg-light">
<div class="container mt-5 col-md-5">
    <div class="card shadow-lg">
        <div class="card-body">
            <h3 class="text-center text-success mb-4">Create Account</h3>
            <form method="post" action="/register">
                <div class="mb-3">
                    <label>Name</label>
                    <input type="text" name="name" class="form-control" required/>
                </div>
                <div class="mb-3">
                    <label>Email</label>
                    <input type="email" name="email" class="form-control" required/>
                </div>
                <div class="mb-3">
                    <label>Password</label>
                    <input type="password" name="password" class="form-control" required/>
                </div>
                <button class="btn btn-success w-100">Register</button>
            </form>
            <p class="text-center mt-3">Already registered? <a href="/login">Login</a></p>
        </div>
    </div>
</div>
</body>
</html>
