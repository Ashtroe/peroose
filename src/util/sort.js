export const sortByScore = (direction,posts,setPosts) => {
  let unsorted = [...posts];

  switch (direction) {
    case 'ascend':
      let ascending = (a, b) => {
        if (a.score < b.score) {
          return 1;
        }
        if (a.score > b.score) {
          return -1;
        }
        return 0;
      };
       setPosts(unsorted.sort(ascending))
      
      break;
    case 'descend':
      let descending = (a, b) => {
        if (a.score < b.score) {
          return -1;
        }
        if (a.score > b.score) {
          return 1;
        }
        return 0;
      };
       setPosts(unsorted.sort(descending))
      
      break;

  }

  
};

export const sortByNew = (posts,setPosts) => {
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
  let sorted =  unsorted.sort(compare);
  setPosts(sorted)
};

export const sortByOld = (posts,setPosts) => {
  let unsorted = [...posts];

  let compare = (a, b) => {
    if (a.date.seconds < b.date.seconds) {
      return -1;
    }
    if (a.date.seconds > b.date.seconds) {
      return 1;
    }
    return 0;
  };
  let sorted =  unsorted.sort(compare);
  setPosts(sorted)
};


