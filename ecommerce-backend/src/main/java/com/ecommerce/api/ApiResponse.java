package com.ecommerce.api;

import java.util.Map;

public class ApiResponse {
    public boolean success;
    public String message;
    public Map<String,Object> data;

    public static ApiResponse ok(Map<String,Object> data) {
        ApiResponse r = new ApiResponse();
        r.success = true;
        r.data = data;
        return r;
    }

    public static ApiResponse fail(String message) {
        ApiResponse r = new ApiResponse();
        r.success = false;
        r.message = message;
        return r;
    }

	public static Object fail(Map<String, Object> errorResponse) {
		// TODO Auto-generated method stub
		return null;
	}
}
