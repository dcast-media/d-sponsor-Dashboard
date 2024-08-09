import * as Popover from "@radix-ui/react-popover";
import * as Tooltip from "@radix-ui/react-tooltip";

const ResponsiveTooltip = ({ text, children }) => {
  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <>
      <div className="md:hidden cursor-help" onClick={handleClick}>
        <Popover.Root>
          <Popover.Trigger asChild>
            <span>{children}</span>
          </Popover.Trigger>
          <Popover.Anchor />
          <Popover.Portal>
            <Popover.Content className="bg-secondaryBlack z-[1000] max-w-lg p-2 rounded-md text-sm shadow-lg border border-jacarta-100 border-opacity-10">
              <p>{text}</p>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      <div className="hidden md:block cursor-help" onClick={handleClick}>
        <Tooltip.Provider delayDuration={0}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <span>{children}</span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="bg-secondaryBlack z-[1000] max-w-lg p-2 text-sm rounded-md shadow-lg border border-jacarta-100 border-opacity-10">
                <p>{text}</p>
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </>
  );
};

export default ResponsiveTooltip;
