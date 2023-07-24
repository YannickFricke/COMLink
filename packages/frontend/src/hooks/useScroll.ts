import { createRef, useEffect } from 'react';

interface ScrollOptions {
    threshold: number;
}

export const useScroll = (options: ScrollOptions) => {
    const ref = createRef<HTMLDivElement>();

    useEffect(() => {
        if (ref.current === null) {
            return;
        }

        const { scrollTop, scrollHeight, clientHeight } = ref.current;

        if (ref.current.children.length === 0) {
            return;
        }

        const difference = (scrollHeight - clientHeight) - scrollTop;

        if (difference > options.threshold) {
            return;
        }

        ref.current.children.item(ref.current.children.length - 1)!.scrollIntoView({
            behavior: 'smooth',
        });
    }, [ref]);

    const scrollToLastItem = () => {
        if (ref.current === null) {
            return;
        }

        if (ref.current.children.length === 0) {
            return;
        }

        ref.current.children.item(ref.current.children.length - 1)!.scrollIntoView({
            behavior: 'smooth',
        });
    };

    return {
        ref,
        scrollToLastItem,
    };
};
