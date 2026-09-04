function selectFrame(styleName) 
    {
      localStorage.setItem('selectedFrame', styleName);
      window.location.href = 'script.js';
    }