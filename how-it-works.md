# 🌐 How the "Go Live" Process Works

This document explains the technical details of how your local project is made accessible via a global URL. The process consists of two main parts: a **Local Web Server** and a **Secure SSH Tunnel**.

---

## 1. The Local Web Server (`python3 -m http.server`)

By default, files on your computer (like `index.html`) are just static data on a disk. To view them as a website that can load other data (like our `landmarks.json` via `fetch`), we need a **Web Server**.

- **The Command**: `python3 -m http.server 8000`
- **What it does**: It tells your computer to "listen" for requests on **Port 8000**. 
- **The Result**: Any browser on your computer can go to `http://localhost:8000` to see the site.
- **Limitation**: This only works for people on your own computer or your local Wi-Fi. It is not "on the internet" yet.

---

## 2. The SSH Tunnel (`ssh ... a.pinggy.io`)

To make your site visible to the outside world, we use a service called **Pinggy**. This uses a technology called a **Reverse SSH Tunnel**.

- **The Command**: `ssh -p 443 -R0:localhost:8000 a.pinggy.io`
- **How it works**:
    1. Your computer establishes a secure, encrypted connection to Pinggy's servers (`a.pinggy.io`).
    2. The `-R0:localhost:8000` flag tells Pinggy: *"Hey, any traffic you receive on your end, send it back through this tunnel to my computer's port 8000."*
    3. Pinggy then generates a random public URL (like `https://...run.pinggy-free.link`).

---

## 3. The Full Data Flow

Here is exactly what happens when someone clicks your public link:

1. **User Request**: A person in another country enters your Pinggy URL in their browser.
2. **Global Routing**: The request travels across the internet to Pinggy's cloud servers.
3. **The Tunnel**: Pinggy sees the request and "pipes" it through the active SSH connection directly to your computer.
4. **Local Handling**: Your Python server receives the request, reads `index.html` from your folder, and sends the code back through the tunnel.
5. **Display**: The user's browser receives the code and renders the "Egypt Wonders" website.

---

## 🚀 Summary of Benefits

| Feature | Why we use it |
| :--- | :--- |
| **No Deployment** | You don't have to upload files to a hosting service (like Netlify or Vercel) every time you change a line of code. |
| **Live Updates** | If you save a change to a CSS file, anyone using the link sees it as soon as they refresh. |
| **Debugging** | I can see the server logs in the terminal to know if a file failed to load. |
| **Security** | The connection is encrypted via SSH, and the tunnel is temporary. |

---

**Note**: Since we are using the Free Tier of Pinggy, the tunnel expires after **60 minutes**. After that, the link will stop working, and we simply run the command again to get a new one.
