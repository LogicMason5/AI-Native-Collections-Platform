import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, FormEvent } from 'react';
import { toast } from 'react-toastify';

import SearchIcon from '@/images/icons/Search.svg';
import styles from '@/styles/modules/DiscoverProfiles.module.scss';

interface Profile {
  username: string;
  name: string;
  avatar: string;
  public_key: string;
  bio: string;
}

export const DiscoverProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch(
          `${API_URL}/profile/ext/getrandom`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch profiles');
        }

        const data: Profile[] = await response.json();
        setProfiles(data);
      } catch (error) {
        toast.error('Unable to load profiles');
        console.error(error);
      }
    };

    fetchProfiles();
  }, [API_URL]);

  const getProfiles = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const searchValue = formData
      .get('search')
      ?.toString()
      .trim();

    if (!searchValue) {
      toast.error('Please enter a username or public key');
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/profile/ext/find`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username_or_public_key: searchValue,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Profile not found');
      }

      setProfiles([data]);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.discoverProfiles}>
      <form
        className={styles.search}
        onSubmit={getProfiles}
      >
        <div className={styles.gap} />

        <input
          type="text"
          name="search"
          placeholder="Search profiles by username or public key"
        />

        <button type="submit">
          <Image
            src={SearchIcon}
            width={30}
            height={30}
            alt="Search"
          />
        </button>
      </form>

      <p>Discover other profiles</p>

      {profiles.length > 0 &&
        profiles.map((profile) => (
          <Link
            key={profile.username}
            href={`/${profile.username}`}
            className={styles.profileBox}
          >
            <div className={styles.upper}>
              <img
                src={profile.avatar}
                className={styles.avatar}
                alt={profile.name}
              />

              <div className={styles.nameGroup}>
                <span className={styles.name}>
                  {profile.name}
                </span>

                <span className={styles.username}>
                  @{profile.username}
                </span>
              </div>

              <div />

              <p>{profile.public_key}</p>
            </div>

            <div className={styles.lower}>
              <p>
                {profile.bio?.replace(
                  '[name_here]',
                  profile.name
                )}
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
};
