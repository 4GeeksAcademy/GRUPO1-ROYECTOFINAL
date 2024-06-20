const getState = ({ getStore, getActions, setStore }) => {
    // Helper function to safely parse JSON from local storage
    const safeParse = (key, defaultValue) => {
        const value = localStorage.getItem(key);
        try {
            return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error(`Error parsing localStorage key "${key}":`, error);
            return defaultValue;
        }
    };

    return {
        store: {
            message: null,
            demo: [
                { title: "FIRST", background: "white", initial: "white" },
                { title: "SECOND", background: "white", initial: "white" }
            ],
            token: localStorage.getItem("token") || null,
            user: safeParse("user", null),
            posts: [],
            favorites: safeParse("favorites", []),
            currentPost: null
        },
        actions: {
            getMessage: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
                    const data = await resp.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error);
                }
            },
            registerUser: async (userData) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(userData)
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setStore({ token: data.access_token, user: data.user });
                        localStorage.setItem("token", data.access_token);
                        localStorage.setItem("user", JSON.stringify(data.user)); // Save user data to local storage
                        return true;
                    } else {
                        return false;
                    }
                } catch (error) {
                    console.error("Error during user registration", error);
                    return false;
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
                        const errorText = await response.text();
                        console.error("Error during user login:", errorText);
                        return false;
                    }
                } catch (error) {
                    console.error("Error during user login", error);
                    return false;
                }
            },
            updateUser: async (userData) => {
                const store = getStore();
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/user", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        },
                        body: JSON.stringify(userData)
                    });
                    if (response.ok) {
                        const updatedUser = await response.json();
                        setStore({ user: updatedUser });
                        localStorage.setItem("user", JSON.stringify(updatedUser));
                        return true;
                    } else {
                        console.error("Error updating user details", response.statusText);
                        return false;
                    }
                } catch (error) {
                    console.error("Error updating user details", error);
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
                    if (response.ok) {
                        const user = await response.json();
                        setStore({ user });
                        localStorage.setItem("user", JSON.stringify(user));
                    } else {
                        console.error("Error fetching user details", response.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching user details", error);
                }
            },
            getPostsByUser: async (userId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/posts?userId=${userId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setStore({ posts: data });
                    } else {
                        console.error("Error fetching user posts", response.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching user posts", error);
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
                    if (response.ok) {
                        const newPost = await response.json();
                        setStore({ posts: [...store.posts, newPost] });
                        return true;
                    } else {
                        return false;
                    }
                } catch (error) {
                    console.error("Error creating post", error);
                    return false;
                }
            },
            getPosts: async () => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/posts");
                    if (response.ok) {
                        const data = await response.json();
                        setStore({ posts: data });
                    }
                } catch (error) {
                    console.error("Error fetching posts", error);
                }
            },
            getPost: async (postId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/posts/${postId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setStore({ currentPost: data });
                    } else {
                        console.error("Error fetching post", response.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching post", error);
                }
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
                    if (response.ok) {
                        const newFavorite = await response.json();
                        const updatedFavorites = [...store.favorites, newFavorite];
                        setStore({ favorites: updatedFavorites });
                        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
                    } else {
                        console.error("Error adding favorite", response.statusText);
                    }
                } catch (error) {
                    console.error("Error adding favorite", error);
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
                    if (response.ok) {
                        const updatedFavorites = store.favorites.filter(fav => fav.post.id !== postId);
                        setStore({ favorites: updatedFavorites });
                        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
                    } else {
                        console.error("Error removing favorite", response.statusText);
                    }
                } catch (error) {
                    console.error("Error removing favorite", error);
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
                    if (response.ok) {
                        const data = await response.json();
                        setStore({ favorites: data });
                        localStorage.setItem("favorites", JSON.stringify(data));
                    } else {
                        console.error("Error fetching favorites", response.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching favorites", error);
                }
            },
            logout: () => {
                setStore({ token: null, user: null, favorites: [] });
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("favorites");
            }
        }
    };
};

export default getState;
