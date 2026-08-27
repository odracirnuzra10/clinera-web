import styles from "./ChannelMarks.module.css";

const CHANNELS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    src: "/images/blog/channels/instagram.svg",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    src: "/images/blog/channels/facebook.svg",
  },
  {
    name: "WhatsApp",
    href: "https://business.whatsapp.com/",
    src: "/images/blog/channels/whatsapp.svg",
  },
] as const;

export default function ChannelMarks() {
  return (
    <ul className={styles.row} aria-label="Canales: Instagram, Facebook y WhatsApp">
      {CHANNELS.map((channel) => (
        <li key={channel.name}>
          <a
            href={channel.href}
            className={styles.rowItem}
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={channel.src}
              alt={channel.name}
              width={28}
              height={28}
              className={styles.icon}
            />
            <span className={styles.label}>{channel.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
