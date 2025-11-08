import {useEffect} from "react";
import {useTranslation} from "react-i18next";

const FacebookComment = ({url}) => {
    const {t} = useTranslation();
    useEffect(() => {
        // Load lại plugin khi component mount (đặc biệt nếu URL thay đổi)
        if (window.FB) {
            window.FB.XFBML.parse();
        }
    }, [url]);

    return (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('facebook_comment.title')}</h2>
            <div class="fb-comments"
                 data-href={url}
                 data-width="100%"
                 data-numposts="5"></div>
        </div>

    );
};

export default FacebookComment;
