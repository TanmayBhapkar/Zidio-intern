import api from "../api/axiosConfig";

// --------------------- BLOGS ---------------------
export const fetchBlogs = (params) =>
  api.get("/blogs", { params }).then((r) => r.data.data);

export const fetchBlog = (id) =>
  api.get(`/blogs/${id}`).then((r) => r.data.data);

export const createBlog = async ({ title, content, tags, imageFile }) => {
  let images = [];
  if (imageFile) {
    const form = new FormData();
    form.append("file", imageFile);
    const upload = await api.post("/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    images.push({ url: upload.data.url, public_id: upload.data.public_id });
  }

  const { data } = await api.post("/blogs", { title, content, tags, images });
  return data;
};

export const updateBlog = async (id, { title, content, tags, imageFile, replaceImages = false }) => {
  let images;
  if (imageFile) {
    const form = new FormData();
    form.append("file", imageFile);
    const upload = await api.post("/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    images = [{ url: upload.data.url, public_id: upload.data.public_id }];
  }

  const { data } = await api.put(`/blogs/${id}`, {
    title,
    content,
    tags,
    images: images || undefined,
    replaceImages: replaceImages.toString(),
  });
  return data;
};

export const deleteBlog = (id) => api.delete(`/blogs/${id}`).then((r) => r.data);

// --------------------- USER BLOGS ---------------------
// Mock: filter blogs by author ID
export const fetchUserBlogs = (userId) =>
  api.get("/blogs").then((r) => r.data.data.filter((b) => b.author._id === userId));

// --------------------- COMMENTS & LIKES ---------------------
// Mock functions: backend routes don't exist
export const addComment = async (blogId, text) => {
  console.warn("addComment: endpoint not implemented in mock backend");
  return { success: false, message: "Not implemented in mock backend" };
};

export const toggleLike = async (blogId) => {
  console.warn("toggleLike: endpoint not implemented in mock backend");
  return { success: false, message: "Not implemented in mock backend" };
};

// --------------------- USERS ---------------------
// Mock functions: backend routes don't exist
export const fetchAllUsers = async () => {
  console.warn("fetchAllUsers: endpoint not implemented in mock backend");
  return { success: false, message: "Not implemented in mock backend" };
};

export const adminDeleteUser = async (userId) => {
  console.warn("adminDeleteUser: endpoint not implemented in mock backend");
  return { success: false, message: "Not implemented in mock backend" };
};
