function parent() {
  const a = 10;
  console.log("parent");

  const child = () => {
    const b = 20;
    console.log(a);
    return 201;
  };

  console.log(child());
}

parent();
