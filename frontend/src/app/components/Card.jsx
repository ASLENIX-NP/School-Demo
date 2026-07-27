export default function Card({icon="✦",title,children}){return <article className="feature-card"><i>{icon}</i><h3>{title}</h3><p>{children}</p></article>}
