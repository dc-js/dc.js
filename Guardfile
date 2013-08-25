# Add files and commands to this file, like the example:
#   watch(%r{file/path}) { `command(s)` }
#
guard 'shell' do
  watch(%r{^src/(.+)\.js$}) { |m| puts `make` }
  watch(%r{^test/(.+)\.js$}) { |m| puts `make` }
end
