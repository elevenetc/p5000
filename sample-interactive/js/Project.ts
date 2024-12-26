import Tag from "./Tag";

class Project {

  id: String;
  title: string;
  date: Date;
  tags: Tag[];

  constructor(title: string, date: Date, tags: Tag[]) {
    this.title = title;
    this.date = date;
    this.tags = tags;
    this.id = title + date.getTime();
  }
}

export default Project;
