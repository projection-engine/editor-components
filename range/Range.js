import PropTypes from "prop-types";
import styles from './styles/Range.module.css'
import {useRef, useState} from "react";

export default function Range(props) {
    const [focused, setFocused] = useState(false)
    let lastMousePlacement = undefined

    let currentValue = props.value
    const handleMouseMove = (e) => {
        if (lastMousePlacement === undefined)
            lastMousePlacement = e.clientX

        if (lastMousePlacement >= e.clientX) {
            currentValue = parseFloat(currentValue) + Math.abs((props.incrementPercentage ? props.incrementPercentage : 0.1) * (e.clientX - lastMousePlacement))
            props.handleChange(currentValue.toFixed(1))
        } else {
            currentValue = parseFloat(currentValue) - Math.abs((props.incrementPercentage ? props.incrementPercentage : 0.1) * (e.clientX - lastMousePlacement))
            props.handleChange(currentValue.toFixed(1))
        }


        lastMousePlacement = e.clientX
    }
    const ref = useRef()
    const handleMouseDown = (e) => {
        if (!focused && !props.disabled) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', handleMouseMove)
                lastMousePlacement = undefined
            }, {once: true})
        } else if (!document.elementsFromPoint(e.clientX, e.clientY).includes(ref.current))
            setFocused(false)
    }

    return (
        <div className={styles.wrapper} style={{'--accentColor': props.accentColor}} title={props.label}>
            <div className={styles.content} >
                {focused ?
                    <input
                        disabled={props.disabled}
                        ref={ref}
                        value={props.value}
                        onMouseDown={handleMouseDown}

                        onChange={(e) => {
                            if (isNaN(parseFloat(e.target.value)))
                                props.handleChange(0.0)
                            else
                                props.handleChange(parseFloat(e.target.value))
                        }} type={'number'}
                        style={{cursor: 'text',background: 'var(--background-3)'}}
                        onBlur={() => {
                            setFocused(false)
                            if(props.onFinish)
                                props.onFinish()
                        }}
                        className={styles.draggable}
                    />
                    :
                    <div
                        ref={ref}
                        onMouseDown={handleMouseDown}
                        onMouseUp={() => {
                            if(props.onFinish)
                                props.onFinish()
                        }}
                        style={{
                            color: props.disabled ? 'var(--fabric-color-quaternary)' : undefined,
                            cursor: props.disabled ? 'default' : undefined,
                            background: props.disabled ? 'var(--background-0)' : undefined
                        }}
                        onDoubleClick={() => setFocused(true)}
                        className={styles.draggable}
                    >
                        {parseFloat(props.value).toFixed(1)}
                    </div>
                }
            </div>

        </div>
    )

}

Range.propTypes = {
    onFinish: PropTypes.func,
    accentColor: PropTypes.string,
    disabled: PropTypes.bool,
    incrementPercentage: PropTypes.number,
    increment: PropTypes.number,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    handleChange: PropTypes.func
}