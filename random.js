// from index.ejx
<form action="/delete" method="POST" >
        <input type="hidden" name="taskIndex" value="<%= index %>" />
        <button type="submit">❌ Delete</button>
      </form>

// from app.js 

app.delete("/delete/:id", (req, res) => {
  const index = req.body.taskIndex;
  todos.splice(index, 1);
  res.redirect("/");
});

