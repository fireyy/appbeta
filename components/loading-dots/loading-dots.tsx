import s from './loading-dots.module.css'

const LoadingDots: React.FC = () => {
  return (
    <div className={s.wrap}>
      <div className={s.loader}></div>
    </div>
  )
}

export default LoadingDots
