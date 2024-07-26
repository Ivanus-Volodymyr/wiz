import React, { ForwardedRef } from 'react';
import Link from 'next/link';

type Props = {
  navItems: Record<'link' | 'name', string>[];
  open: boolean;
};

const MobileNav = ({ navItems, open }: Props, ref: ForwardedRef<HTMLUListElement>) => {
  return (
    <>
      {open && (
        <div className="lg:hidden">
          <div className="bg-main-secondary opacity-30 fixed w-full h-full top-0 left-0 z-[1]"></div>
          <ul
            ref={ref}
            className="lg:hidden bg-white drop-shadow shadow-[#0D18351A] w-full top-[137px] left-0 fixed overflow-auto md:w-1/2 md:h-full z-[3] lg:z-[31]"
          >
            {navItems.map((item) => (
              <Link key={item.name} href={item.link}>
                <li className="border-b-[1px] border-b-border-default p-5 flex space-x-5 justify-center">
                  <span className="text-base font-medium text-[#0D1835]">{item.name}</span>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default React.forwardRef(MobileNav);
