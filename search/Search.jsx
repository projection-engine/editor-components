import PropTypes from "prop-types";
import styles from './styles/Search.module.css'

export default function Search(props) {
    return (
        <div className={styles.wrapper} style={{width: props.width, height: props.size === 'big' ? '30px' : undefined}}>
            <div className={styles.inputWrapper}>
                <span style={{fontSize: '1rem'}} className={'material-icons-round'}>search</span>
                <input placeholder={'Search'} className={styles.input}
                       onChange={e => props.setSearchString(e.target.value)} value={props.searchString}/>
            </div>
        </div>
    )
}

Search.propTypes = {
    size: PropTypes.oneOf(['big', 'default']),
    width: PropTypes.string,
    searchString: PropTypes.string,
    setSearchString: PropTypes.func
}