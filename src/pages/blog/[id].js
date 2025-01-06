import { client } from "../../libs/client";
import { Image } from '@/utils/common-components'
import { formatDate, formatDotSplitDate } from '../../utils/utilities.js'
import { useRouter } from 'next/router'

export default function BlogId({ blog }) {
  const router = useRouter()

  const handleBack = () => {
    if(document.referrer) {
      router.back()
    }else {
      router.push('/blog') //履歴が無い場合はblog一覧ページへ戻る
    }
  }

  return (
    <div className="section__group">
      <section className="news-detail">
        <div className="news-detail__card glass card" data-size="medium">
          <div className="news-detail__card-body card__body">
            <div className="news-detail__list">
              <article className="news-detail__item">
                <div className="news-detail__head">
                  <time datetime={formatDate(blog.publishedAt)} className="news-detail__time">{formatDotSplitDate(blog.publishedAt)}</time>
                  <h2 className="news-detail__title">{blog.title}</h2>
                </div>
                <div className="news-detail__mainimage">
                  <Image
                    src={`${blog.mainImage.url}?fm=webp`}
                    width={blog.mainImage.width}
                    height={blog.mainImage.height}
                    alt=""
                  />
                </div>
                <div
                  className="news-detail__body prose"
                  dangerouslySetInnerHTML={{
                    __html: `${blog.body}`,
                  }}
                />
              </article>
            </div>
          </div>
        </div>
      </section>
      <div className="text-center">
        <button className="btn" onClick={handleBack}>
          <span className="btn__body">ブログ一覧へ戻る</span>
        </button>
      </div>
    </div>
  );
}

// 静的生成のためのパスを指定します
export const getStaticPaths = async () => {
  const data = await client.get({ endpoint: "blog" });

  const paths = data.contents.map((content) => `/blog/${content.id}`);
  return { paths, fallback: false };
};

// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async (context) => {
  const id = context.params.id;
  const data = await client.get({ endpoint: "blog", contentId: id });
  // console.log(data)
  return {
    props: {
      blog: data,
    },
  };
};