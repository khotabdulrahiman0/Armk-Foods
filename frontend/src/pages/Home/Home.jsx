import { useState } from 'react';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <>
      <Header />
      <div id="explore-menu">
        <ExploreMenu setCategory={setCategory} category={category} />
      </div>
      <FoodDisplay category={category} />
    </>
  );
};

export default Home;
