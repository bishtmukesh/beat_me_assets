const importAllImages = (r) => {
    return r.keys().map(r);
};
  
export const userIcons = importAllImages(
    require.context('/src/assets/images/userIcons', false, /\.(png|jpe?g|svg)$/)
);