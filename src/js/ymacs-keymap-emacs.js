//> This file is part of Ymacs, an Emacs-like editor for the Web
//> http://www.ymacs.org/
//>
//> Copyright (c) 2009-2012, Mihai Bazon, Dynarch.com.  All rights reserved.
//>
//> Redistribution and use in source and binary forms, with or without
//> modification, are permitted provided that the following conditions are
//> met:
//>
//>     * Redistributions of source code must retain the above copyright
//>       notice, this list of conditions and the following disclaimer.
//>
//>     * Redistributions in binary form must reproduce the above copyright
//>       notice, this list of conditions and the following disclaimer in
//>       the documentation and/or other materials provided with the
//>       distribution.
//>
//>     * Neither the name of Dynarch.com nor the names of its contributors
//>       may be used to endorse or promote products derived from this
//>       software without specific prior written permission.
//>
//> THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
//> EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
//> IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
//> PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE
//> FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
//> CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
//> SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
//> INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
//> CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
//> ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
//> THE POSSIBILITY OF SUCH DAMAGE.

// @require ymacs-keymap.js

// This is the default keymap, as configured in
// Ymacs_Buffer::makeDefaultKeymap.  It follows closely the standard
// Emacs keybindings, with some small deviations that match my taste
// (search for "my stuff" below).

// It would be nice to have more options, such as an Eclipse keymap,
// or Visual Studio -- but I'm not familiar with any of them.
// Contributions welcome.

// A keymap inherits from Ymacs_Keymap and should define its bindings
// in D.KEYS.  They can also define a defaultHandler property to take
// whatever action they consider necessary -- for example the Isearch
// keymap will, by default, print the entered character in the
// minibuffer and trigger a search action.  Isearch mode is almost
// completely defined in a keymap -- with the minor note that
// isearch_forward and isearch_backward are assigned below to key
// combinations; once pressed, they will push the Isearch keymap onto
// the buffer's keymap stack, and it will be used until isearch is
// ended.

/* KEY DEFINITIONS.  A key is generally defined in standard Emacs
   notation, with the following notes:

   - it is possible to define multiple keys at once for the same
   operation, by using the "&&" combination (separate with spaces
   from the actual keys)

   - some special characters are named literally; their names contain
   more than one character.  The available names are defined in
   DlKeyboard (see keyboard.js in DynarchLIB).  Examples:
   ARROW_RIGHT, PAGE_UP, etc. but also SPACE and DASH.

   Normally you would define commands using Ymacs_Buffer.newCommands
   (see ymacs-commands.js) and specify the command name for key
   bindings, but you can specify a function as well, if you want:

   "C-8": function() {
   alert("You pressed CTRL-8");
   }

   It is advised to define commands for more than simple cases, for
   two reasons:

   1. they can be used for "non-interactive" calls too

   2. the command name is saved in this.currentCommand /
   this.previousCommand, which is useful in a number of cases.

*/

DEFINE_SINGLETON("Ymacs_Keymap_Emacs", Ymacs_Keymap, function(D, P){

    var TMPL_INFO = String.template(
        "<table>",
        "<tr><td style='text-align: right; font-weight: bold'>Char:</td><td><tt> $ch </tt></td></tr>",
        "<tr><td style='text-align: right; font-weight: bold'>Char code:</td><td> $code / 0x$codeHex </td></tr>",
        "<tr><td style='text-align: right; font-weight: bold'>Position:</td><td> $point </td></tr>",
        "<tr><td style='text-align: right; font-weight: bold'>Mark:</td><td> $mark </td></tr>",
        "<tr><td style='text-align: right; font-weight: bold'>Buffer size:</td><td> $sizeKB </td></tr>",
        "</table>"
    );

    D.KEYS = {
        // movement
        "ArrowUp     && C-p"                      : "backward_line",
        "ArrowDown   && C-n"                      : "forward_line",
        "ArrowLeft   && C-b"                      : "backward_char",
        "ArrowRight  && C-f"                      : "forward_char",
        "Home"                                    : "beginning_of_indentation_or_line",
        "End && C-e"                              : "end_of_line",
        "C-a"                                     : "beginning_of_line",
        "C-Home && M-<"                           : "beginning_of_buffer",
        "C-End && M->"                            : "end_of_buffer",
        "C-ArrowRight && M-f"                     : "forward_word",
        "C-ArrowLeft && M-b"                      : "backward_word",
        "C-ArrowDown"                             : "forward_paragraph",
        "C-ArrowUp"                               : "backward_paragraph",
        "C-l"                                     : "recenter_top_bottom",
        "PageUp"                                  : "scroll_up_half",
        "PageDown"                                : "scroll_down_half",
        "WheelUp"                                 : "scroll_up",
        "WheelDown"                               : "scroll_down",

        // transient mark
        "S-ArrowUp       && S-C-p"                : "backward_line_mark",
        "S-ArrowDown     && S-C-n"                : "forward_line_mark",
        "S-ArrowLeft     && S-C-b"                : "backward_char_mark",
        "S-ArrowRight    && S-C-f"                : "forward_char_mark",
        "S-C-ArrowRight  && S-M-f"                : "forward_word_mark",
        "S-C-ArrowLeft   && S-M-b"                : "backward_word_mark",
        "S-C-ArrowDown"                           : "forward_paragraph_mark",
        "S-C-ArrowUp"                             : "backward_paragraph_mark",
        "S-Home"                                  : "beginning_of_indentation_or_line_mark",
        "S-C-a"                                   : "beginning_of_line_mark",
        "S-End && S-C-e"                          : "end_of_line_mark",
        "S-C-Home"                                : "beginning_of_buffer_mark",
        "S-C-End"                                 : "end_of_buffer_mark",

        // basic editing
        "Backspace"                               : "backward_delete_char",
        "Delete && C-d"                           : "delete_char",
        "Enter && C-m"                            : "newline",
        "M-d && C-Delete"                         : "kill_word",
        "C-Backspace && M-Backspace && M-Delete"  : "backward_kill_word",
        "C-k"                                     : "kill_line",
        "C-y && S-Insert"                         : "yank",
        "M-y"                                     : "yank_pop",
        "C-Space"                                 : "set_mark_command",
        "C-x C-x"                                 : "exchange_point_and_mark",
        "C-w"                                     : "kill_region",
        "M-t"                                     : "transpose_words",
        "C-t"                                     : "transpose_chars",
        "C-x C-t"                                 : "transpose_lines",
        "M-w"                                     : "copy_region_as_kill",
        "M-c"                                     : "capitalize_word",
        "M-u"                                     : "upcase_word",
        "M-l"                                     : "downcase_word",
        "F11"                                     : "nuke_trailing_whitespace",
        "Tab"                                     : "indent_line",
        "C-M-\\"                                  : "indent_region",
        "M-q"                                     : "fill_paragraph",
        "C-/ && C-x u && C-_ && C-z"              : "undo",
        "Insert"                                  : "overwrite_mode",
        "M-s"                                     : "center_line",
        "M-/"                                     : "dabbrev_expand",
        "C-s"                                     : "isearch_forward",
        "C-r"                                     : "isearch_backward",
        "C-S-s"                                   : "isearch_yank_word_or_char",
        "M-C-s"                                   : "isearch_forward_regexp",
        "M-C-r"                                   : "isearch_backward_regexp",
        "M-%"                                     : "query_replace",
        "C-u"                                     : "universal_argument",
        "M-g"                                     : "goto_line",
        "C-x h"                                   : "mark_whole_buffer",
        "C-g"                                     : "keyboard_quit",
        "M-^"                                     : "delete_indentation",
        "M-;"                                     : "comment_dwim",

        // vertical editing
        "C-x r t"                                 : "string_rectangle",
        "C-x r c"                                 : "clear_rectangle",
        "C-x r k"                                 : "kill_rectangle",
        "C-x r y"                                 : "yank_rectangle",

        // buffers
        "C-x C-ArrowRight && C-x ArrowRight && C-Tab"    : "next_buffer",
        "C-x C-ArrowLeft && C-x ArrowLeft && C-S-Tab"    : "previous_buffer",
        "C-x b"                                          : "switch_to_buffer",
        "C-x k"                                          : "kill_buffer",

        // frames
        "C-x 0"                                   : "delete_frame",
        "C-x 1"                                   : "delete_other_frames",
        "C-x 2"                                   : "split_frame_vertically",
        "C-x 3"                                   : "split_frame_horizontally",
        "C-x o"                                   : "other_frame",
        "C-x l"                                   : "toggle_line_numbers",

        // eval
        "M-x"                                     : "execute_extended_command",

        // necessary evil
        "C-S-y && C-v"                            : "yank_from_operating_system",
        "M-S-w"                                   : "copy_for_operating_system",

        // my stuff, sorry if these have different meanings in the standard Emacs keys
        "M-S-y"                                   : "yank_shift", // that's the reverse of yank_shift
        "C-c /"                                   : "close_last_xml_tag",
        "S-Backspace"                             : "backward_delete_whitespace",
        "S-Delete"                                : "delete_whitespace",
        "C-M-d"                                   : "delete_region_or_line",
        "M-Enter"                                 : "start_next_paragraph",
        "M-S-q"                                   : "fill_paragraph_no_prefix",
        "C-M-|"                                   : "cperl_lineup",
        "C-F4"                                    : "kill_buffer",
        "M-ArrowLeft"                             : [ "windmove", "left" ],
        "M-ArrowRight"                            : [ "windmove", "right" ],
        "M-ArrowUp"                               : [ "windmove", "up" ],
        "M-ArrowDown"                             : [ "windmove", "down" ],

        "C-x e"                                   : "kmacro_end_and_call_macro",
        "C-x ("                                   : "kmacro_start_macro",
        "C-x )"                                   : "kmacro_end_macro",

        // file system commands
        "C-x C-f"                                 : "find_file",
        "C-x C-w"                                 : "write_file",
        "C-x C-s"                                 : "save_buffer",
        "C-x s"                                   : "save_some_buffers",

        // others
        "C-x =": function() {
            var ch = this.charAt(), chname = ch;
            if (ch == " ")
                chname = "Space";
            else if (ch == "\n")
                chname = "Newline";
            this.signalInfo(TMPL_INFO({
                ch      : chname.htmlEscape(),
                code    : ch.charCodeAt(0),
                codeHex : ch.charCodeAt().hex(),
                point   : this.point(),
                mark    : this.markMarker.getPosition(),
                size    : this.getCodeSize(),
                sizeKB  : this.getCodeSize().formatBytes(2)
            }), true);
        }
    };

    P.defaultHandler = [ "self_insert_command" ];

});

DEFINE_SINGLETON("Ymacs_Keymap_UniversalArgument", Ymacs_Keymap, function(D, P){

    P.defaultHandler = [ Ymacs_Interactive("^", function(){
        var ev = this.interactiveEvent();
        var ch = ev.key;
        var prefix = this.getPrefixArg(true);
        if ((/^[0-9]$/.test(ch) || (ch === "-" && prefix === "")) && !ev.altKey && !ev.ctrlKey) {
            prefix += ch;
            this.setPrefixArg(prefix);
            if (!this.isMinibuffer) {
                this.whenMinibuffer(function(mb){
                    mb.cmd("insert", " ", ch);
                });
            }
            return true;
        }
        this.popKeymap(Ymacs_Keymap_UniversalArgument());
        return false;
    }) ];

    P.attached = function(buffer) {
        buffer.setPrefixArg("");
    };

});
