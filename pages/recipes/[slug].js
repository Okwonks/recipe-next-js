import { useState } from 'react';

import Image from 'next/image';

import {
  PortableText,
  sanityClient,
  urlFor,
  usePreviewSubscription,
} from '../../lib/sanity';

const recipeQuery = `*[_type == "recipe" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  mainImage,
  ingredient[]{
    _key,
    unit,
    wholeNumber,
    fraction,
    ingredient->{
      name
    }
  },
  instructions,
  likes
}`;

export default function OneRecipe({ data, preview }) {
  const { data: recipe } = usePreviewSubscription(recipeQuery, {
    params: { slug: data.recipe?.slug.current },
    initialData: data,
    enabled: preview,
  });


  const [likes, setLikes ] = useState(data?.recipe?.likes);

  const addLike = async () => {
    const res = await fetch('/api/handle-like', {
      method: 'POST',
      body: JSON.stringify({ _id: recipe._id }),
    })
    .catch(err => console.log(err));

    const data = await res.json();
    setLikes(data.likes);
  };

  if (!recipe.name) {
    return <div>Loading...</div>;
  }

  return (
    <article className="recipe">
      <h1>{recipe.name}</h1>
      <button className="like-btn" onClick={addLike}>{likes} 🔥</button>
      <main className="content">
        <Image
          alt={recipe.name}
          src={urlFor(recipe?.mainImage).url()}
          height={500}
          width={500}
        />
        <div className="breakdown">
          <ul className="ingredients">
           {recipe.ingredient?.map(i => (
            <li key={i._key} className="ingredient">
              {i?.wholeNumber}
              {i?.fraction}
              {" "}
              {i?.unit}
              <br />
              {i?.ingredient.name}
            </li>
           ))}
          </ul>
          <PortableText
            blocks={recipe?.instructions}
            className="instructions"
          />
        </div>
      </main>
    </article>
  );
}

export async function getStaticPaths() {
  const paths = await sanityClient.fetch(
    `*[_type == "recipe" && defined(slug.current)]{
      "params": {
        "slug": slug.current
      }
    }`
  );
  return { paths, fallback:true };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const recipe = await sanityClient.fetch(recipeQuery, { slug });
  return { props: { data:{ recipe }, preview:true }};
}
