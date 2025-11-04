import styles from "./Card.module.css";

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  description: string;
  price: string;
  inStock: boolean;
}

interface CardProps {
  product: Product;
  isSelected: boolean;
  setSelectedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const Card = (props: CardProps) => {
  const addToSelection = (product: Product) => {
    props.setSelectedProducts((prev) => [...prev, product]);
  };

  const removeFromSelection = (productId: number) => {
    props.setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };
  return (
    <div key={props.product.id} className={styles.productCard}>
      <div className={styles.productImage}>
        <img src={props.product.image} alt={props.product.name} />
      </div>
      <div className={styles.productInfo}>
        <h3>{props.product.name}</h3>
        <p>{props.product.description}</p>
        <div className={styles.productMeta}>
          <span className={styles.price}>{props.product.price}</span>
          <span
            className={`${styles.status} ${
              props.product.inStock ? styles.inStock : styles.outOfStock
            }`}
          >
            {props.product.inStock ? "В наличии" : "Под заказ"}
          </span>
        </div>
        <button
          onClick={() =>
            props.isSelected
              ? removeFromSelection(props.product.id)
              : addToSelection(props.product)
          }
          className={`${styles.selectButton} ${
            props.isSelected ? styles.selected : ""
          }`}
        >
          {props.isSelected ? "Убрать" : "Выбрать"}
        </button>
      </div>
    </div>
  );
};
