import { BookOpen, Code2, Link as LinkIcon } from "lucide-react";

export function ProductPreview() {
  return (
    <figure className="product-preview">
      <div className="product-preview-frame" aria-hidden="true">
        <aside className="product-preview-sider">
          <div className="product-preview-brand" />
          <div className="product-preview-nav">
            <span className="product-preview-nav-item product-preview-nav-item--active" />
            <span className="product-preview-nav-item" />
            <span className="product-preview-nav-item" />
            <span className="product-preview-nav-item" />
          </div>
        </aside>
        <div className="product-preview-main">
          <div className="product-preview-toolbar">
            <span className="product-preview-search" />
          </div>
          <div className="product-preview-cards">
            <article className="product-preview-card">
              <BookOpen size={14} strokeWidth={1.75} />
              <span className="product-preview-card-line" />
              <span className="product-preview-card-line product-preview-card-line--short" />
            </article>
            <article className="product-preview-card product-preview-card--code">
              <Code2 size={14} strokeWidth={1.75} />
              <span className="product-preview-card-line" />
              <span className="product-preview-card-line product-preview-card-line--short" />
            </article>
            <article className="product-preview-card">
              <LinkIcon size={14} strokeWidth={1.75} />
              <span className="product-preview-card-line" />
              <span className="product-preview-card-line product-preview-card-line--short" />
            </article>
          </div>
        </div>
      </div>
      <figcaption className="product-preview-caption">
        A calm workspace for notes, code, and saved links.
      </figcaption>
    </figure>
  );
}
