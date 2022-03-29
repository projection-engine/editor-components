import {useEffect, useMemo, useRef, useState} from "react";
import getBezierCurve from "../utils/bezierCurve";
import {TYPES} from "../TYPES";
import NODE_TYPES from "../NODE_TYPES";
import TYPES_INFO from "../TYPES_INFO";


export default function useBoard(hook, scale, setScale){
    const ref = useRef()

    const handleWheel = (e) => {
        e.preventDefault()
        if (e.wheelDelta > 0 && scale < 3)
            setScale(scale + scale * .1)
        else if (e.wheelDelta < 0 && scale >= .5)
            setScale(scale - scale * .1)
    }


    useEffect(() => {
        ref.current?.parentNode.addEventListener('wheel', handleWheel, {passive: false})
        return () => {
            ref.current?.parentNode.removeEventListener('wheel', handleWheel, {passive: false})
        }
    }, [scale])


    const handleLink = (src, target, isExecution) => {
        hook.setLinks(prev => {
            let c = [...prev]

            const existing = c.filter(c => ( c.target.id === target.id && c.target.attribute.key === target.attribute.key) || (isExecution && c.source.id === src.id && c.source.attribute.key === src.attribute.key))


            c =  c.filter(cc => {
                return !existing.find(e => e === cc)
            })


            c.push({
                source: src,
                target: target
            })
            return c
        })
    }
    const links = useMemo(() => {
        return hook.links.map(l => {
            let key = (Object.entries(TYPES).find(([_, value]) => value === l.source.attribute.type))
            if (key)
                key = key[0]

            return {
                target: l.target.id + l.target.attribute.key,
                source: l.source.id + l.source.attribute.key,
                targetKey: l.target.attribute.key,
                sourceKey: l.source.attribute.key,
                color: TYPES_INFO[key]
            }
        })
    }, [hook.links])

    let currentFrame = 0

    const updateLinks = () => {
        try {
            let parentBBox = ref.current?.getBoundingClientRect()
            const bounding = {
                x: ref.current?.scrollLeft - parentBBox.left,
                y: ref.current?.scrollTop - parentBBox.top
            }

            links.forEach(l => {
                const target = document.getElementById(l.target)?.getBoundingClientRect()
                const source = document.getElementById(l.source)?.getBoundingClientRect()
                const linkPath = document.getElementById(l.target + '-' + l.source)
                const supplementary = linkPath.nextSibling
                if (target && source && linkPath) {
                    const curve = getBezierCurve(
                        {
                            x: (source.x + bounding.x + 7.5) / scale,
                            y: (source.y + bounding.y + 7.5) / scale
                        },
                        {
                            x1: (target.x + bounding.x + 7.5) / scale,
                            y1: (target.y + bounding.y + 7.5) / scale
                        })
                    supplementary.setAttribute('d', curve)
                    linkPath.setAttribute('d', curve)
                }
            })
        } catch (error) {
        }
        currentFrame = requestAnimationFrame(updateLinks)
    }

    useEffect(() => {
        currentFrame = requestAnimationFrame(updateLinks)
        return () => {
            cancelAnimationFrame(currentFrame)
        }
    }, [links, scale])
    return {

        links,
        ref,
        handleLink
    }
}