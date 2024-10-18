const API_BASE_URL = process.env.PUBLIC_APP_ENDPOINT || "https://kku-blog-server.onrender.com";

export const fetchAdminProfile = async (id: string): Promise<any> => {
  if (!id) {
    throw new Error("Invalid Admin ID");
  }

  const token = sessionStorage.getItem("adminToken");
  if (!token) {
    console.error("No token found, redirecting to login...");
    return null;
  }

  const url = `${API_BASE_URL}/admin/${id}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const statusText = response.statusText || "Unknown Error";
      throw new Error(
        `Server returned ${response.status} ${statusText} for ${url}`
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const responseData = await response.text();
      return responseData;
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error:", (error as Error).message);

    if (error instanceof TypeError) {
      console.error("Network error or CORS issue");
    } else if (error instanceof SyntaxError) {
      console.error("Error parsing JSON response");
    }

    return null;
  }
};

export const fetchUser = async () => {
  const token = sessionStorage.getItem("userId");
  if (!token) {
    console.error("No token found, redirecting to login...");
    return;
  }
  const response = await fetch("http://localhost:3001/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await response.json();
  return data;
};

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ทั้งหมดจาก backend
export const fetchUsersAPI = async () => {
  const token = sessionStorage.getItem("userId");
  if (!token) {
    console.error("No token found, redirecting to login...");
    return;
  }

  const response = await fetch("http://localhost:3001/admin/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await response.json();
  return data;
};

export const fetchAllUser = async () => {
  const token = sessionStorage.getItem("userId");
  if (!token) {
    console.error("No token found, redirecting to login...");
    return;
  }

  const response = await fetch("http://localhost:3001/admin/viewer", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await response.json();
  return data;
};

export const deleteUserAPI = async (userId: string): Promise<void> => {
  const adminToken = sessionStorage.getItem("userId"); // ดึง token จาก sessionStorage

  if (!adminToken) {
    throw new Error("No admin token found. Unauthorized request.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`, // ส่ง token ไปใน header
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
