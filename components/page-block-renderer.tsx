import type { PageBlock } from "@/src/core/content/types";

export function PageBlockRenderer({ block }: { block: PageBlock }) {
  switch (block.type) {
    case "text":
      return (
        <section className="section-block">
          <h3 className="section-block__title">{block.title}</h3>
          {block.paragraphs.map((paragraph) => (
            <p className="section-block__text" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </section>
      );

    case "summary":
      return (
        <section className="section-block">
          {block.title && <h3 className="section-block__title">{block.title}</h3>}
          {block.paragraphs?.map((paragraph) => (
            <p className="section-block__text" key={paragraph}>
              {paragraph}
            </p>
          ))}
          <dl className="project-summary">
            {block.items.map((item) => (
              <div className="project-summary__item" key={item.label}>
                <dt className="project-summary__label">{item.label}</dt>
                <dd className="project-summary__value">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      );

    case "timeline":
      return (
        <section className="section-block">
          <h3 className="section-block__title">{block.title}</h3>
          {block.introduction && (
            <p className="section-block__text">{block.introduction}</p>
          )}
          <ol className="project-timeline">
            {block.items.map((item, index) => (
              <li className="project-timeline__item" key={item.title}>
                <span className="project-timeline__number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="project-timeline__content">
                  <h4 className="project-timeline__title">{item.title}</h4>
                  <p className="project-timeline__text">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
          {block.callout && (
            <aside className="project-callout">
              <h4 className="project-callout__title">{block.callout.title}</h4>
              <p className="project-callout__text">{block.callout.text}</p>
              {block.callout.emphasis && (
                <strong className="project-callout__emphasis">
                  {block.callout.emphasis}
                </strong>
              )}
            </aside>
          )}
        </section>
      );

    case "card-grid":
      return (
        <section className="section-block">
          <h3 className="section-block__title">{block.title}</h3>
          {block.introduction && (
            <p className="section-block__text">{block.introduction}</p>
          )}
          <div className="project-grid">
            {block.cards.map((card) => (
              <article className="ui-card" key={card.title}>
                <p className="ui-card__eyebrow">{card.eyebrow}</p>
                <h4 className="ui-card__title">{card.title}</h4>
                <p className="ui-card__text">{card.text}</p>
              </article>
            ))}
          </div>
        </section>
      );

    case "table":
      return (
        <section className="section-block">
          <h3 className="section-block__title">{block.title}</h3>
          {block.introduction && (
            <p className="section-block__text">{block.introduction}</p>
          )}
          <div className="project-block__table-wrap">
            <table className="project-block__table">
              <caption className="project-block__table-caption">{block.caption}</caption>
              <thead className="project-block__table-head">
                <tr className="project-block__table-row">
                  {block.columns.map((column) => (
                    <th className="project-block__table-cell" key={column}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr className="project-block__table-row" key={`${block.id}-${rowIndex}`}>
                    {row.map((cell, cellIndex) => (
                      <td
                        className="project-block__table-cell"
                        key={`${block.id}-${rowIndex}-${cellIndex}`}
                      >
                        {cell.href ? (
                          <a
                            className="project-block__table-link"
                            href={cell.href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {cell.text}
                          </a>
                        ) : (
                          cell.text
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.closing && <p className="section-block__text">{block.closing}</p>}
        </section>
      );
  }
}
