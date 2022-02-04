export const join = (req,res) => {
    return res.send("Join ☕");
}

export const login = (req,res) => {
    return res.render("login");
}

export const logout = (req,res) => {
    return res.send("Log out ☕");
}

export const see = (req,res) => {
    return res.send("See Users ☕");
}

export const edit = (req,res) => {
    return res.send("Edit Users ☕")
}

export const remove = (req,res) => {
    return res.send("Delete Users ☕")
}