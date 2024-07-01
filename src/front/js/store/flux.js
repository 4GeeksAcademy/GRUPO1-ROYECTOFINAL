const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            demo: [
                { title: "FIRST", background: "white", initial: "white" },
                { title: "SECOND", background: "white", initial: "white" }
            ],
            token: localStorage.getItem("token") || null,
            user: JSON.parse(localStorage.getItem("user")) || null,
            posts: [],
            favorites: JSON.parse(localStorage.getItem("favorites")) || [],
            currentPost: null,
            requests: [],
            sentRequests: []
        },
        actions: {
            // Manejo de alertas para tokens expirados
            checkTokenExpiration: async (response) => {
                if (response.status === 401) {
                    const result = await response.json();
                    if (result.msg === "Token has expired") {
                        alert("Token has expired. Please log in again.");
                        getActions().logout();
                    }
                }
                return response;
            },
            
            uploadImageToCloudinary: async (imageFile) => {
                const formData = new FormData();
                formData.append('file', imageFile);

                const options = {
                    method: 'POST',
                    body: formData,
                };

                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/upload`, options);
                    if (!response.ok) throw new Error('Failed to upload image');
                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error('Error uploading image:', error);
                    return null;
                }
            },

            getMessage: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
                    const data = await resp.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.error("Error loading message from backend:", error);
                }
            },

            registerUser: async (userData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/register`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(userData)
                    });
                    if (response.ok) {
                        const data = await response.json();
                        return data;
                    } else {
                        console.error("Error during user registration:", await response.text());
                        return null;
                    }
                } catch (error) {
                    console.error("Error during user registration:", error);
                    return null;
                }
            },

            loginUser: async (credentials) => {
                const actions = getActions();
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(credentials)
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setStore({ token: data.access_token, user: data.user });
                        localStorage.setItem("token", data.access_token);
                        localStorage.setItem("user", JSON.stringify(data.user));
                        await actions.getFavorites();
                        return true;
                    } else {
                        console.error("Error during user login:", await response.text());
                        return false;
                    }
                } catch (error) {
                    console.error("Error during user login:", error);
                    return false;
                }
            },

            updateUser: async (userData, imageFile) => {
                const store = getStore();
            
                const formData = new FormData();
                formData.append('nombre', userData.nombre);
                formData.append('telefono', userData.telefono);
                formData.append('email', userData.email);
                if (imageFile) {
                    formData.append('image', imageFile);
                }
            
                const options = {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${store.token}`,
                    },
                    body: formData,
                };
            
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/users/${store.user.id}`, options);
                    if (!response.ok) throw new Error('Error updating user');
            
                    const updatedUser = await response.json();
                    setStore({ user: updatedUser });
                    return true;
                } catch (error) {
                    console.error('Error updating user:', error);
                    return false;
                }
            },

            getUserDetails: async () => {
                const store = getStore();
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/protected", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        }
                    });
                    const checkedResponse = await getActions().checkTokenExpiration(response);
                    if (checkedResponse.ok) {
                        const user = await checkedResponse.json();
                        setStore({ user });
                        localStorage.setItem("user", JSON.stringify(user));
                    } else {
                        console.error("Error fetching user details:", await checkedResponse.text());
                    }
                } catch (error) {
                    console.error("Error fetching user details:", error);
                }
            },
            deleteUser: async (userId) => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/users/${userId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        }
                    });
                    if (response.ok) {
                        setStore({ user: null, token: null });
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        return true;
                    } else {
                        console.error("Error deleting user:", await response.text());
                        return false;
                    }
                } catch (error) {
                    console.error("Error deleting user:", error);
                    return false;
                }
            },

            getPostsByUser: async () => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/user-posts`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        }
                    });
                    const checkedResponse = await getActions().checkTokenExpiration(response);
                    if (checkedResponse.ok) {
                        const data = await checkedResponse.json();
                        setStore({ posts: data });
                    } else {
                        console.error("Error fetching user posts:", await checkedResponse.text());
                    }
                } catch (error) {
                    console.error("Error fetching user posts:", error);
                }
            },

            createPost: async (postData) => {
                const store = getStore();
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/posts", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        },
                        body: JSON.stringify(postData)
                    });
                    const checkedResponse = await getActions().checkTokenExpiration(response);
                    if (checkedResponse.ok) {
                        const newPost = await checkedResponse.json();
                        setStore({ posts: [...store.posts, newPost] });
                        return true;
                    } else {
                        console.error("Error creating post:", await checkedResponse.text());
                        return false;
                    }
                } catch (error) {
                    console.error("Error creating post:", error);
                    return false;
                }
            },

            getPosts: async () => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/posts");
                    if (response.ok) {
                        const data = await response.json();
                        setStore({ posts: data });
                    } else {
                        console.error("Error fetching posts:", await response.text());
                    }
                } catch (error) {
                    console.error("Error fetching posts:", error);
                }
            },

            getAllPostsUnrestricted: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/all-posts`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setStore({ posts: data });
                    } else {
                        console.error("Error fetching all posts:", await response.text());
                    }
                } catch (error) {
                    console.error("Error fetching all posts:", error);
                }
            },

            getPost: async (postId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/posts/${postId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setStore({ currentPost: data });
                        return data;
                    } else {
                        console.error("Error fetching post:", await response.text());
                    }
                } catch (error) {
                    console.error("Error fetching post:", error);
                }
            },

            updatePost: async (postId, postData) => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/posts/${postId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        },
                        body: JSON.stringify(postData)
                    });
                    const checkedResponse = await getActions().checkTokenExpiration(response);
                    if (checkedResponse.ok) {
                        const updatedPost = await checkedResponse.json();
                        const updatedPosts = store.posts.map(post =>
                            post.id === postId ? updatedPost : post
                        );
                        setStore({ posts: updatedPosts });
                        return true;
                    } else {
                        console.error("Error updating post:", await checkedResponse.text());
                        return false;
                    }
                } catch (error) {
                    console.error("Error updating post:", error);
                    return false;
                }
            },

            deletePost: async (postId) => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/posts/${postId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        }
                    });
                    const checkedResponse = await getActions().checkTokenExpiration(response);
                    if (checkedResponse.ok) {
                        const updatedPosts = store.posts.filter(post => post.id !== postId);
                        setStore({ posts: updatedPosts });
                        return true;
                    } else {
                        console.error("Error deleting post:", await checkedResponse.text());
                        return false;
                    }
                } catch (error) {
                    console.error("Error deleting post:", error);
                    return false;
                }
            },

            setCurrentPost: (post) => {
                setStore({ currentPost: post });
            },

            addFavorite: async (postId) => {
                const store = getStore();
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/favorites", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        },
                        body: JSON.stringify({ post_id: postId })
                    });
                    const checkedResponse = await getActions().checkTokenExpiration(response);
                    if (checkedResponse.ok) {
                        const newFavorite = await checkedResponse.json();
                        const updatedFavorites = [...store.favorites, newFavorite];
                        setStore({ favorites: updatedFavorites });
                        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
                    } else {
                        console.error("Error adding favorite:", await checkedResponse.text());
                    }
                } catch (error) {
                    console.error("Error adding favorite:", error);
                }
            },

            removeFavorite: async (postId) => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/favorites/${postId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        }
                    });
                    const checkedResponse = await getActions().checkTokenExpiration(response);
                    if (checkedResponse.ok) {
                        const updatedFavorites = store.favorites.filter(fav => fav.post.id !== postId);
                        setStore({ favorites: updatedFavorites });
                        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
                    } else {
                        console.error("Error removing favorite:", await checkedResponse.text());
                    }
                } catch (error) {
                    console.error("Error removing favorite:", error);
                }
            },

            getFavorites: async () => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/favorites`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        }
                    });
                    const checkedResponse = await getActions().checkTokenExpiration(response);
                    if (checkedResponse.ok) {
                        const data = await checkedResponse.json();
                        setStore({ favorites: data });
                        localStorage.setItem("favorites", JSON.stringify(data));
                    } else {
                        console.error("Error fetching favorites:", await checkedResponse.text());
                    }
                } catch (error) {
                    console.error("Error fetching favorites:", error);
                }
            },

            createContactRequest: async (request) => {
                const store = getStore();
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/contact-requests", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        },
                        body: JSON.stringify(request)
                    });
                    const checkedResponse = await getActions().checkTokenExpiration(response);
                    if (checkedResponse.ok) {
                        const newRequest = await checkedResponse.json();
                        setStore({ requests: [...store.requests, newRequest] });
                        return { success: true };
                    } else {
                        const errorMsg = await checkedResponse.text();
                        console.error("Error creating contact request:", errorMsg);
                        return { success: false, msg: errorMsg };
                    }
                } catch (error) {
                    console.error("Error creating contact request:", error);
                    return { success: false, msg: "Error al enviar la solicitud de contacto" };
                }
            },

            getContactRequestHistory: async () => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/contact-requests/history`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setStore({ contactRequestHistory: data });
                    } else {
                        console.error("Error fetching contact request history:", await response.text());
                    }
                } catch (error) {
                    console.error("Error fetching contact request history:", error);
                }
            },

            getRequests: async () => {
                const store = getStore();
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/contact-requests", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        }
                    });
                    const checkedResponse = await getActions().checkTokenExpiration(response);
                    if (checkedResponse.ok) {
                        const data = await checkedResponse.json();
                        setStore({ requests: data });
                    } else {
                        console.error("Error fetching requests:", await checkedResponse.text());
                    }
                } catch (error) {
                    console.error("Error fetching requests:", error);
                }
            },

            getSentRequests: async () => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/contact-requests/sent`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        }
                    });
                    const checkedResponse = await getActions().checkTokenExpiration(response);
                    if (checkedResponse.ok) {
                        const data = await checkedResponse.json();
                        setStore({ sentRequests: data });
                    } else {
                        console.error("Error fetching sent requests:", await checkedResponse.text());
                    }
                } catch (error) {
                    console.error("Error fetching sent requests:", error);
                }
            },

            acceptRequest: async (requestId) => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/contact-requests/${requestId}/accept`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        }
                    });
                    if (response.ok) {
                        const newRequests = store.requests.filter(request => request.id !== requestId);
                        setStore({ requests: newRequests });
                    } else {
                        console.error("Error accepting request:", await response.text());
                    }
                } catch (error) {
                    console.error("Error accepting request:", error);
                }
            },
            rejectRequest: async (requestId) => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/contact-requests/${requestId}/reject`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        }
                    });
                    if (response.ok) {
                        const newRequests = store.requests.filter(request => request.id !== requestId);
                        setStore({ requests: newRequests });
                    } else {
                        console.error("Error rejecting request:", await response.text());
                    }
                } catch (error) {
                    console.error("Error rejecting request:", error);
                }
            },
            logout: () => {
                setStore({ token: null, user: null, favorites: [], requests: [] });
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("favorites");
                localStorage.removeItem("requests");
            }
        }
    };
};

export default getState;
