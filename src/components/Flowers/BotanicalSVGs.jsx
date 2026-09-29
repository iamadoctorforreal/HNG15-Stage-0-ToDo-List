import React from 'react';

// Lavender Sprig with slender stem and clustered purple buds
export const LavenderFlower = ({ className = "w-16 h-32", color = "currentColor" }) => (
  <svg
    viewBox="0 0 100 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Stem */}
    <path
      d="M50 230 C50 180, 52 120, 50 10"
      stroke="#7A9373"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    {/* Leaves */}
    <path
      d="M51 180 C65 170, 75 185, 78 195 C68 198, 55 190, 51 185"
      fill="#8FA887"
      opacity="0.85"
    />
    <path
      d="M49 150 C35 140, 25 155, 22 165 C32 168, 45 160, 49 155"
      fill="#8FA887"
      opacity="0.85"
    />
    <path
      d="M51 120 C62 112, 70 122, 72 130 C64 132, 55 126, 51 123"
      fill="#8FA887"
      opacity="0.85"
    />

    {/* Lavender Florets / Buds (layered soft purples) */}
    <g className="transition-transform duration-300">
      {/* Tier 1 - Base */}
      <ellipse cx="43" cy="98" rx="8" ry="12" transform="rotate(-25 43 98)" fill="#9B8FC2" />
      <ellipse cx="57" cy="95" rx="8" ry="12" transform="rotate(25 57 95)" fill="#B4A7D6" />
      <ellipse cx="50" cy="90" rx="7" ry="11" fill="#C9BFE3" />

      {/* Tier 2 */}
      <ellipse cx="42" cy="78" rx="8" ry="12" transform="rotate(-28 42 78)" fill="#9B8FC2" />
      <ellipse cx="58" cy="76" rx="8" ry="12" transform="rotate(28 58 76)" fill="#B4A7D6" />
      <ellipse cx="50" cy="72" rx="7" ry="11" fill="#D3C9EC" />

      {/* Tier 3 */}
      <ellipse cx="43" cy="58" rx="7" ry="11" transform="rotate(-30 43 58)" fill="#8A7CB3" />
      <ellipse cx="57" cy="56" rx="7" ry="11" transform="rotate(30 57 56)" fill="#B4A7D6" />
      <ellipse cx="50" cy="52" rx="7" ry="10" fill="#E2DBF5" />

      {/* Tier 4 */}
      <ellipse cx="44" cy="40" rx="6" ry="10" transform="rotate(-32 44 40)" fill="#9B8FC2" />
      <ellipse cx="56" cy="38" rx="6" ry="10" transform="rotate(32 56 38)" fill="#C2B7E2" />
      <ellipse cx="50" cy="34" rx="6" ry="9" fill="#E8E2F8" />

      {/* Tier 5 - Tip */}
      <ellipse cx="46" cy="22" rx="5" ry="8" transform="rotate(-20 46 22)" fill="#B4A7D6" />
      <ellipse cx="54" cy="21" rx="5" ry="8" transform="rotate(20 54 21)" fill="#C9BFE3" />
      <ellipse cx="50" cy="14" rx="5" ry="7" fill="#EAE5F9" />
      <circle cx="50" cy="8" r="4" fill="#F0ECFC" />
    </g>
  </svg>
);

// Rose with soft petals, extra-long elegant stalk, leaves, and thorny elegance
export const RoseFlower = ({ className = "w-24 h-48", color = "currentColor" }) => (
  <svg
    viewBox="0 0 120 360"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Extra Long Graceful Stem */}
    <path
      d="M60 350 C54 280, 68 200, 58 130 C54 95, 62 80, 60 68"
      stroke="#6B8564"
      strokeWidth="4"
      strokeLinecap="round"
    />
    
    {/* Thorns along the long stalk */}
    <path d="M57 290 C51 288, 48 293, 47 296 C51 296, 56 294, 57 293" fill="#5A7253" />
    <path d="M63 245 C69 243, 72 248, 73 251 C69 251, 64 249, 63 248" fill="#5A7253" />
    <path d="M58 190 C52 188, 49 193, 48 196 C52 196, 57 194, 58 193" fill="#5A7253" />
    <path d="M61 140 C67 138, 70 143, 71 146 C67 146, 62 144, 61 143" fill="#5A7253" />

    {/* Lower Leaf Tier */}
    <path
      d="M58 260 C32 245, 12 268, 8 285 C28 290, 50 278, 58 268"
      fill="#7B9974"
    />
    <path
      d="M58 260 C32 245, 12 268, 8 285"
      stroke="#5D7956"
      strokeWidth="1.5"
    />

    {/* Middle Leaf Tier */}
    <path
      d="M63 210 C88 192, 110 212, 114 228 C94 234, 72 224, 63 216"
      fill="#85A37E"
    />
    <path
      d="M63 210 C88 192, 110 212, 114 228"
      stroke="#66825F"
      strokeWidth="1.5"
    />

    {/* Upper Leaf Tier */}
    <path
      d="M57 150 C38 135, 20 152, 18 165 C34 170, 52 162, 57 155"
      fill="#7B9974"
    />
    <path
      d="M57 150 C38 135, 20 152, 18 165"
      stroke="#5D7956"
      strokeWidth="1.5"
    />

    {/* Calyx (green sepals under rose) */}
    <path
      d="M48 68 C52 76, 68 76, 72 68 C66 82, 54 82, 48 68Z"
      fill="#5A7553"
    />

    {/* Blossom Petals (Romantic Rose Pink layers) */}
    <g>
      {/* Outer Petals */}
      <path
        d="M28 50 C24 30, 48 20, 60 32 C72 20, 96 30, 92 50 C94 65, 78 74, 60 72 C42 74, 26 65, 28 50Z"
        fill="#F3B6CE"
        opacity="0.9"
      />
      <path
        d="M34 52 C32 38, 50 28, 60 38 C70 28, 88 38, 86 52 C88 64, 75 70, 60 69 C45 70, 32 64, 34 52Z"
        fill="#E89EB9"
      />
      {/* Mid Petals */}
      <path
        d="M42 46 C40 36, 54 32, 60 38 C66 32, 80 36, 78 46 C80 55, 70 60, 60 59 C50 60, 40 55, 42 46Z"
        fill="#D97A9B"
      />
      {/* Inner Petal / Core Swirl */}
      <path
        d="M48 42 C48 35, 58 34, 60 37 C62 34, 72 35, 72 42 C72 48, 66 52, 60 51 C54 52, 48 48, 48 42Z"
        fill="#C45E82"
      />
      <path
        d="M54 39 C54 36, 60 35, 62 38 C64 41, 60 44, 58 43 C56 42, 54 41, 54 39Z"
        fill="#A64468"
      />
    </g>
  </svg>
);

// Daffodil with graceful stem, corona trumpet, and bright star petals
export const DaffodilFlower = ({ className = "w-20 h-32", color = "currentColor" }) => (
  <svg
    viewBox="0 0 120 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Stem */}
    <path
      d="M58 230 C56 160, 62 100, 58 60"
      stroke="#728D6A"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* Slender Long Leaves */}
    <path
      d="M56 190 C38 150, 30 110, 26 80 C36 100, 48 140, 56 175"
      fill="#87A37F"
    />
    <path
      d="M60 180 C78 140, 86 100, 90 70 C80 95, 68 135, 60 165"
      fill="#7B9974"
    />

    {/* Daffodil Blossom Head (angled forward) */}
    <g transform="translate(0, 0)">
      {/* 6 Perianth Petals (Creamy Daffodil Yellow) */}
      {/* Top Petal */}
      <path d="M58 10 C50 25, 54 44, 58 52 C62 44, 66 25, 58 10Z" fill="#FFF4B8" />
      {/* Top Right */}
      <path d="M96 28 C80 34, 70 48, 64 54 C72 52, 88 44, 96 28Z" fill="#FFEAA0" />
      {/* Bottom Right */}
      <path d="M94 76 C80 68, 70 58, 64 54 C70 62, 82 78, 94 76Z" fill="#FFE48E" />
      {/* Bottom Petal */}
      <path d="M58 96 C52 82, 54 62, 58 56 C62 62, 64 82, 58 96Z" fill="#FFF0AC" />
      {/* Bottom Left */}
      <path d="M22 76 C36 68, 46 58, 52 54 C46 62, 34 78, 22 76Z" fill="#FFEAA0" />
      {/* Top Left */}
      <path d="M20 28 C36 34, 46 48, 52 54 C44 52, 28 44, 20 28Z" fill="#FFF4B8" />

      {/* Corona / Trumpet (Golden Yellow with ruffled edge) */}
      <ellipse cx="58" cy="54" rx="17" ry="17" fill="#F6D55C" />
      <ellipse cx="58" cy="54" rx="13" ry="13" fill="#F4B942" />
      {/* Ruffled rim */}
      <path
        d="M45 54 C44 48, 50 43, 58 43 C66 43, 72 48, 71 54 C70 60, 65 65, 58 65 C51 65, 46 60, 45 54Z"
        fill="#E89B2B"
        opacity="0.9"
      />
      {/* Center Depth & Stamen */}
      <circle cx="58" cy="54" r="5" fill="#C27A18" />
      <circle cx="56" cy="52" r="1.5" fill="#FFE79A" />
      <circle cx="60" cy="53" r="1.5" fill="#FFE79A" />
      <circle cx="58" cy="56" r="1.5" fill="#FFE79A" />
    </g>
  </svg>
);
