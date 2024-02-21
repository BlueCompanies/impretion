import styles from "./styles.module.css";

function GenericLoader() {
  return (
    <div className={styles.loadingSpinner}>
      <div className={styles.spinner}>
        <div></div>
      </div>
    </div>
  );
}

export default GenericLoader;
