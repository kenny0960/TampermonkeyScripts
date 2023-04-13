import { FlexBubble } from '@/lineBot';

export const getScreenshotFlexBubble = (imageUrl: string, title: string): FlexBubble => {
    return {
        type: 'bubble',
        size: 'giga',
        body: {
            spacing: 'md',
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'text',
                    text: title,
                    size: 'xl',
                    weight: 'bold',
                },
                {
                    type: 'image',
                    size: 'full',
                    aspectMode: 'fit',
                    url: imageUrl,
                    animated: true,
                    aspectRatio: '16:9',
                },
            ],
        },
    };
};
