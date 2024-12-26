class Tag {

  id: string;
  title: string;

  constructor(title: string) {
    this.title = title;
    this.id = title;
  }
}

export default Tag;
