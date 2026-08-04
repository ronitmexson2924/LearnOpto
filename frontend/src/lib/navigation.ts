type NavigateOptions = {
  replace?: boolean;
};

export const navigateTo = (path: string, options: NavigateOptions = {}) => {
  if (options.replace) {
    window.history.replaceState({}, "", path);
  } else {
    window.history.pushState({}, "", path);
  }

  window.dispatchEvent(new PopStateEvent("popstate"));
};

export const navigateBack = () => {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }

  navigateTo("/");
};

export const reloadCurrentPage = () => {
  window.location.reload();
};
