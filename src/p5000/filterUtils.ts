import View from "./View";

function viewById(views: View[], id: string): View {
  views.forEach(view => {
    if (view.id === id) {
      return view
    }
  })
  throw new Error("View with id `" + id + "` not found")
}

export {
  viewById
}
