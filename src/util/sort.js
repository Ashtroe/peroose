export const sortByScore = (posts) => {
  let unsorted = [...posts];

  let compare = (a, b) => {
    if (a.score < b.score) {
      return 1;
    }
    if (a.score > b.score) {
      return -1;
    }
    return 0;
  };
  return unsorted.sort(compare);
};

export const sortByNew = (posts) => {
  let unsorted = [...posts];

  let compare = (a, b) => {
    if (a.date.seconds < b.date.seconds) {
      return 1;
    }
    if (a.date.seconds > b.date.seconds) {
      return -1;
    }
    return 0;
  };
 return unsorted.sort(compare);
};


