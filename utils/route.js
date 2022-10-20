const route = (e) => {
  e.preventDefault();
  const href = e.target.closest("a").getAttribute("href");
  const [path, params] = href.split("/:");
  console.log(path, params);
  if (window.location.pathname === path) return;

  console.log(params ? href : path);
  window.history.pushState(null, null, params ? href : path);

  return { path, params };
};

export default route;
