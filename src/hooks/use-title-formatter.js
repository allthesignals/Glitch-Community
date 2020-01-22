const useTitleFormatter = (title) => title.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1));

export default useTitleFormatter;
