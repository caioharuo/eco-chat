import Lottie from "react-lottie";
import recycleLoading from "../assets/images/recycle-loading.json";
import styles from "../styles/components/Loading.module.css";

export default function Loading() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: recycleLoading,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className={styles.loadingContainer}>
      <Lottie
        options={defaultOptions}
        height={300}
        width={300}
        isClickToPauseDisabled={true}
      />
      <h2>Carregando...</h2>
    </div>
  );
}
